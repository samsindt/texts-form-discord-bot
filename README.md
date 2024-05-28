# texts-form-discord-bot

This bot reacts to a slash command /add-text and responds with a modal form for submitting information about texts to a Google sheet. I opted to use
AWS Lambda in order to make this free for me (hopefully) and because I wanted to get some practice using the service. Because lambda spins up a new stack
when a trigger is invoked, I had to use Discord's interaction endpoint API instead of their much more expansive websocket-based API. I also opted to use Docker
and AWS CDK because copy pasting code into AWS Console makes me queasy and I think would have made it difficult to use TypeScript. Anyways, this little
project went through way too many iterations for what it is, but I learned a lot of tooling so I'm not mad. 

Why multiple lambda functions? Well, for some reason the Discord interaction was timing out by the time updating the Google sheet was finished some
of the time. So in order to make it asynchronous I needed to invoke another lambda function. This seems to no longer be an issue for some reason and
I am now just invoking the google sheet updater lambda synchronously so errors will surface in Discord. I am coping by telling myself that I have made things more 
modular by doing this.

