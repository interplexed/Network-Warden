# Network Warden
A dual powerhouse combination of [Suricata](https://suricata.io/) and [Kismet](https://kismetwireless.net) observable from a high-level React dashboard, with data being stored in TimeScaleDB hypertables.  

**Status:** *In Active Development*

### Goals
The goal is to bring logs together in a persistent system, provide an easily consumable view on what device is doing what, and of course to amplify alerts.


## How To Use
- On a Docker host (on GNU/Linux such as Ubuntu), git clone this project.  Rename `.envExample` to `.env`, and edit the `REACT_APP_API_URL`, setting `docker_host_ip_address` correctly.  Use e.g. `docker compose up --build` to create and start the containers

### Suricata
- Provide access to the Suricata eve.json log.  In the dev environment, this is via SMBv3 from a remote network sensor, and it's mounted to `/mnt/suricata_logs`
- Make sure Suricata is configured correctly and running, and verify in the container logs for `suricata-service` that EVE logs are being inserted.  You may wish to check some of the Suricata [jq](https://docs.suricata.io/en/latest/output/eve/eve-json-examplesjq.html) examples
- Access the project dashboard.  That's going to be `http://<docker_host_ip_address>:3000`
- Try the datepicker; Suricata EVE logs will be available for the green highlighted dates

### Kismet
- *It's on the way* 


## Thanks
A project like this will benefit from support, and all kinds are welcome!  

Clearly many, *many* features and design choices are possible in future.  
Please reach out via GitHub Issues or links in my profile.  Thanks for looking!

