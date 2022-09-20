# How to use

First, build and configure the discord-music-bot-backend project.


Then build this project and run the discord-music-bot-backend application followed by the built discord-music-bot application once it has initialized.


In the home tab of the application you will need to press the "add new server" button and supply your discord server's id. (Google how to get the server id if you do not know how.)

(For the previous step you will need to first create a bot invite link for the server you are wanting to add the bot to using discord's bot dashboard)


Following that, you will be able to select the server and channel you wish to join. 

# Queueing and play tracks

The bot can play both local audio files as well as youtube links. To add a track, navigate to the "Tracks" screen and press the "add track" button. 
There you can copy and paste youtube links or the path to the file on your system. If you are specifying a local file be sure to selecte "Local Resource" from the
media type dropdown.

Once you have tracks added, right click on them and add them to queue. 
On the "Playback" screen your queued tracks will appear and you can play, pause, remove them, etc from there.


# How to build

In the project folder, type "npm run make". This will create an "out" folder which will contain the built application and its required files.
