
# Express session

#### What I found:
The following piece of code **must** be used before connecting to database.

- **name**: sets the name of the cookie stored in browser. By default its connect.sid. 
- **cookie.path**: this says that the cookie works for the specified route and subroutes under it ( can't explain better than the pros so [read here.](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.4) )
- **cookie.maxAge**: time-to-live for the cookie stored in browser (in millisec).
- **store.ttl**: the time-to-live for session stored (in sec *probably*).

```
app.use(session({
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	name: 'CSID',
	cookie: { path: '/', httpOnly: true, maxAge: 36000},
	store: MongoStore.create({
		mongoUrl: process.env.DBSTRING,
		ttl: 60*60,
	})
}));
```
This piece of code should be inserted before the above code. It prevents caching of pages so that clicking back/forward buttons in browser won't show the content it showed before. ***Useful for login/logout***.
```
app.use((req, res, next)=>{
	res.set('Cache-control', 'no-store');
	next();
})
```

***

No session is stored if no new variable or any kind of data is not attached to the session or, if the session is not modified anyway.
```
router.get('/', (req, res)=>{
	console.log(req.session);
});
```
> Running this code showed the session data, but no session was stored in the MongoStore. The session was stored only when some kind of change was made to it:
```
router.get('/', (req, res)=>{
	req.session.any_variable = 1;   //anything with any value can be here, 
	console.log(req.session);		//as long as it does not cause an error.
});
```

##### req.session.regenerate ( callback (err) { } )
```
router.get('/views', (req, res)=>{
	req.session.regenerate(function(err){
		res.send(req.session.id);
	});
});
```
The above code would generate a new session whenever '/views' route was called. 

To understand the Cache-control better, use this. If the Cache-control is disabled, it will create new session every time '/' and '/views' route is called by back and forward buttons in browser. But enabling it will only create new session if called from URL bar or if page is reloaded.