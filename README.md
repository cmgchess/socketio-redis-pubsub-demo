 Nginx conf

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