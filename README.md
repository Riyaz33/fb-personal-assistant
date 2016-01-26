# FB Personal Assistant (TaskBot)
A personal FB Messenger bot to help with keeping track of upcoming tasks. 

#### Setup

+ Clone project

	```
	git clone https://github.com/riyaz33/fb-personal-assistant && cd fb-personal-assistant
	```

+ Install npm deps

	```
	npm install
	```

+ Add FB credentials

	```
	touch config.js
	```

	```javascript
	module.exports.fb = { // Facebook credentials
		e: '', // Email
		p: '' // Password
	}
	```

+ Run app

	```
	mongod
	```
	
	```
	node index.js
	```
