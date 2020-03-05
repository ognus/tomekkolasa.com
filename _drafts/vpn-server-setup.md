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



## 5. Additonal: add routing to other subnets