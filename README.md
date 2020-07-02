# :eye_speech_bubble: Twitter clone :speech_balloon:
A self-hosted twitter-like app (implementing most twitter features - the best way i can :D)
## :blue_book: Motivation :open_book:
I'm developing this as a side project mainly to serve as a *learning experience* developing a full stack app with JavaScript using modern JS techniques and libraries (mainly express related, but i also used some to do other stuff, like [**uuid**](https://github.com/uuidjs/uuid) to generate random session tokens), and to showcase it on my future portfolio (that i didn't build yet!) using a live deploy somewhere in the future. I'll try applying most of what i learned in my short web development career, so i can exercise my javascript skills. This also means that i'll using a lot of unecessary things for a project of this small scale (like **redis** for caching session tokens) but i think over-engineering projects is a cool way to learn and apply new concepts that you are still learning. 

Honestly, i would keep this private because i'm still learning but i figured it maybe cool for friends to see my progress and what i'm currently working on. Also there is nothing to be afraid/ashamed of, i'm still learning! So that's why i turned this public only now :tada:

## :card_file_box: Project structure :open_file_folder:
I am trying to follow the current structure:
![project structure](https://i2.wp.com/www.coreycleary.me/wp-content/uploads/2018/11/Express-REST-API-Struc.png?w=741&ssl=1)
*(based off of [https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way/](https://www.coreycleary.me/project-structure-for-an-express-rest-api-when-there-is-no-standard-way/) and some other cools articles i read about the subject)*
The idea behind is:

 - **In the HTTP/Express context:**
	 - **Routes/Routers** only receive requests and send them to the approppriate controllers and their functions
	 - **Controllers** mainly handle the requests and call in all the **services** that are necessary to fulfill them, and later return if everything worked out or not
 - **Outside the HTTP/Express context:**
	 - **Services** are responsible for business logic and accessing all the necessary **Models**, **Internal services**, and **External API's** to validate/process/create data, and return the status to the controller
	 - **Models** are responsible for providing database queries with accessible functions to the services.

The context is separated like that by basically (you can see more on the article i linked above) separation of concerns and ease of testing/switching web framework (if ever needed), to make different parts of the app structure more modular and easy to manage later.

## :clipboard: Current status :wrench:
. This is currently only the backend API, but i plan on turning this into a monorepo with both the front-end (that i plan on building on react) and back-end.

Any advice is welcome!

## :heavy_check_mark: Available features :checkered_flag:

 - Authentication done with *session based tokens* (using [**redis**](https://redis.io/) for storing the token => session pair)
 - More to come! **See to-do below**
## :gear: Installation :computer:
 - Clone the repo with `git clone https://github.com/andrestevao/twitter-clone`
 - Change directory with `cd twitter-clone`
 - Install dependencies with `npm install` (make sure you have node and npm installed)
 - Rename the file named `.env.sample` on the root directory with `mv .env.sample .env`
 - Fill `.env` file variables with your settings
 - run `npm run migrate` to populate DB with necessary tables
 - run `npm start` to start listening on the configured port and you're ready to use the api! :)
## :flashlight: Usage :mag:

Most usage is through post requests to the api. Please see `/routes/index.js` to see all available routes. I'll update this later with all routes and their usage.

## :scroll: To-do :fountain_pen:

 - [ ] Listen in HTTPS, so i can deploy this safely later
 - [ ] Implement testing
 - [ ] Figure out the best way to use promises/async-await syntax (in the code i'm mixing them all up, not sure if that is a good thing to do)
 - [ ] Make the code uniform in general
 - [ ] Read Roy Fielding's REST paper and use proper REST methods and codes (i'm only using Post and general codes like 500, 401, 200)
 - [ ] Implement features
	 - [ ] Profile infos
		 - [ ] Avatar
		 - [ ] Bio
		 - [ ] Etc
	 - [ ] Tweeting
		 - [X] Tweet
		 - [ ] Retweet
		 - [ ] Reply
		 - [ ] Delete tweet
	 - [ ] Following
		 - [ ] Follow
		 - [ ] Unfollow
		 - [ ] Block
	 - [ ] Getting tweets
		 - [ ] Show tweets from users you follow
		 - [ ] Show relevant tweets (users that are followed by many users you follow)
	 - [ ] Notifications
	 - [ ] DMing
	 - [ ] The ones below i have no clue how to even use on the actual app
		 - [ ] Lists
		 - [ ] Topics
		 - [ ] Saved itens
		 - [ ] Moments
