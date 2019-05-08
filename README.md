# Mixify
Mixify allows you to mix everyone's Spotify tastes into one great playlist.

Try it out here: http://mixify-client.surge.sh/

See server repo here: https://github.com/ziruihao/mixify-server

### Features
#### Spotify Authentication

The app authenticates with Spotify. The main user is the 'owner' of the mixes that are made.
![alt text](https://github.com/ziruihao/mixify-client/blob/master/src/img/auth.png)

#### Collaborators

Collaborators can join the 'Mix' to get their music tastes added into the playlist! Right now, the authentication process to add new users is tricky. Essentially, they have to follow a link (in incognito mode, without cookies) to sign in to their own Spotify account, and receive a temporary token on callback, which they then paste into the client app. I plan to make this absolutely seamless by porting the app data into a database and allowing multi-way connections to a 'Mix room.'

![alt text](https://github.com/ziruihao/mixify-client/blob/master/src/img/collab.png)

#### Music Taste Mixer

Mixify combines everyone's preferences together to form one big playlist that everyone can enjoy!

![alt text](https://github.com/ziruihao/mixify-client/blob/master/src/img/mixer.png)

#### Shows on Spotify

The newly created playlist will be sent over to the owner's Spotify account, from which they can play.

![alt text](https://github.com/ziruihao/mixify-client/blob/master/src/img/spotify.png)

#### Web Player

![alt text](https://github.com/ziruihao/mixify-client/blob/master/src/img/player2.png)

Ideally, the app has a built-in web-player, so the owner doesn't have to go back to the Spotify app to play the music. I got this working on development environment (not Surge), but it's currently not working in deployment. I am looking for ways to fix this.



