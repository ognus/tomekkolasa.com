---
title: How to restart a pod in Kubernetes
description: ""
---

One Producer, multiple consumers.

You can restart a specific pod using it's deployment name:

```bash
kubectl rollout restart deployment/DEPLOYMENT_NAME
```

This is a rolling restart, so all the replicas will be taken down one by one to make sure there is no down time.

## Scheduled Pod restarts

Lets have a look at how we can restart a Pod from within the cluster.

We'll use a cronjob to schedule the restart of another Pod. This example will help us understand the latter use case. Not sure if scheduling Pod restarts is very useful in inself. But can be useful for restarting some servers after batch job.

In our Cron Job we'll call `kubectl rollout restart` so we'll need a container with `kubectl` installed. Lets just grab an existing image: `bitnami/kubectl`, but any image with `kubectl` should be fine.

Our cron job will look something like:

```yaml
apiVersion: batch/v1beta1
kind: CronJob
metadata:
  name: pod-restart
spec:
  concurrencyPolicy: Forbid
  schedule: "0 0 * * *" # cron spec of time, e.g. midnight
  jobTemplate:
    spec:
      template:
        spec:
          serviceAccountName: pod-restart-service-account # name of the service account
          restartPolicy: Never
          containers:
            - name: restarter
              image: bitnami/kubectl
              command:
                - kubectl
                - rollout
                - restart
                - deployment/YOUR_DEPLOYMENT_NAME
```

Service Account

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: pod-restart-service-account
```

Role

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-restart
rules:
  - apiGroups: ["apps", "extensions"]
    resources: ["deployments"]
    resourceNames: ["YOUR_DEPLOYMENT_NAME"]
    verbs: ["get", "patch"]
```

RoleBinding

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: pod-restart
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: pod-restart
subjects:
  - kind: ServiceAccount
    name: pod-restart-service-account
```

## Batch job
