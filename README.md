**Prerequisites**

 - [Realtime Chat With Users & Rooms - Socket.io, Node & Express](https://www.youtube.com/watch?v=jD7FnbI76Hg "Realtime Chat With Users & Rooms - Socket.io, Node & Express")
 - [REPO - bradtraversy/chatcord](https://github.com/bradtraversy/chatcord)

**Additional Tools**

 - [nginx](http://nginx.org/en/download.html)
 - [Redis](https://redis.io/download/)
 - [Node.js](https://nodejs.org/en/download/) v14+
 - [http-server](https://www.npmjs.com/package/http-server)

[Here](https://kasunprageethdissanayake.medium.com/installing-redis-x64-3-2-100-on-windows-and-running-redis-server-94db3a98ae3d) is a MSI installer I found for Redis.

**Setup**

 1. Clone repository
 2. cd into `server` and `npm install`


 **Nginx conf**

```bash
http {

    upstream backend {
        hash '$remote_addr $cookie_zzz $http_user_agent';
	server 127.0.0.1:1212;
        server 127.0.0.1:1213;
    }
		
    server {
        listen 80;
	root E:\\socket\\server;

	location / {
            proxy_pass http://backend;
        }
    }
}

events { }

```
**Running client**
 1. cd into`client`
 2. run `http-server . --cors --port=5500`

**Running server**

 1. cd into `server` and open 2 terminals for the same directory
 2. Set 2 different ports ( ex: `export PORT=1212` in one terminal and `export PORT=1213` in the other)
 3. Start nginx with the given configuration
 4. `npm start` the server on both terminals
 
Now Server 1 will be started on `PORT=1212` and Server 2 on `PORT=1213` and the Client on `PORT=5500`. Two servers will be load balanced using nginx on `PORT=80` so the client will be directed to either Server 1 or 2 when it hits Port 80. Hash based load balancing is enabled (to achieve stickiness) since nginx open source doesn't allow cookie based load balancing. Go to http://127.0.0.1:5500/ with 2 browsers (Edge and Chrome for example) then the 2 instances will be connected to Server 1 and 2 respectively. 
Redis will act as a [PubSub](https://redis.io/docs/manual/pubsub/) mechanism and is enabled using [Socket.IO Redis Adapter](https://socket.io/docs/v4/redis-adapter/).
