---
title:  "How to quickly setup a VPN server on AWS"
date:   2020-03-04 21:26:12 +0900
---

I think the quickest way is actually just get a marketplace image on AWS, but it comes with cost or restrictions.


https://dev.to/yashints/let-s-setup-a-vpn-server-for-free-on-aws-under-5-min-1mg4

https://medium.com/hackernoon/using-a-vpn-server-to-connect-to-your-aws-vpc-for-just-the-cost-of-an-ec2-nano-instance-3c81269c71c2

# How to quickly setup a VPN server

We will use OpenVPN server.

There is a really convenient [OpenVPN install script](https://github.com/Nyr/openvpn-install). It walks you through several questions. If you know your host's public IP and are happy with the default you get a VPN server up and running in less the a minute.

I'm gonna do it all on Ubuntu, but it should be very similar on other Linux distributions.

## 1. Get host's public IP or domain

## 2. Install OpenVPN

Thanks to the install script, it's super easy. Just download and execute the script.

```bash
wget https://git.io/vpn -O openvpn-install.sh && sudo bash openvpn-install.sh
```

TODO: add step by step questions

At this point you're pretty much done if you're only after a basic setup. The install script installs and runs the OpenVPN server; creates server certificate and encryption keys; as well as the client config file.


## 3. Get the config file

## 4. Additonal: add user password authentication
https://openvpn.net/community-resources/using-alternative-authentication-methods/

## 5. Additonal: add routing to other subnets
https://openvpn.net/community-resources/setting-up-routing/

https://openvpn.net/vpn-server-resources/how-to-add-users-to-your-openvpn-access-server-using-pam/