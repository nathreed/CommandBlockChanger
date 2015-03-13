# CommandBlockChanger
Customizes command blocks in a Minecraft world.

#Uses
This program doesn't really have many uses as-is. It doesn't do anything with the values it generates for the command blocks other than putting them in the command blocks. The original idea for the use of this was to customize an adventure map upon download from a specialized site and store the random values in a database to enable the setting and retrieval of in-game passwords (via scoreboard values) that were unique on each download of the map (to prevent someone just putting all the passwords on a website somewhere). This would add an interesting new layer to playing adventure maps, as the map maker could make the player do some online interaction (such as watching a video explaining an important map mechanic) and taking a quiz on it in order to get the password to the next part of the map. This has not yet been implemented.


#Installation  
To install all dependencies, simply run `npm install`.  

#Running  
Invoke the program with `node index.js ~/path/to/minecraft/world/folder`, specifying the path to your Minecraft world folder inside Minecraft's `saves` folder. The program will read `map.mapmeta`, make the changes to your world specified in it, and exit.  

#mapmeta file format  
The mapmeta file is simply a JSON file that tells the program which command blocks to change. It has 2 sections, the `changes` section and the `values` section.  
##`changes` section  
The `changes` section is the section of the mapmeta file that tells the program the locations of the command blocks it will be modifying. It is an array of objects. Each object has 4 properties, `x`, `y,`, `z`, and `Command`. The `x`, `y`, and `z` properties should be set to the coordinates of the command block in your world. The `Command` property should be set to the final command that will be in the block, with the variable part enclosed in `%` signs.  
##`values` section  
The `values` section is the section of the mapmeta file that tells the program whether the variable values you specified in the `changes` section should be generated randomly, replaced with a static value that you specify, or randomly generated but shared among multiple command blocks. 
  
  
If you would like a variable value to be randomly generated, place the same name you used for the variable in the `changes` section inside the `randomValues` array.  
  
  
If you would like a variable value to be the same, non-random value in all the command blocks you specified it for, place the same name you used for the variable in the `changes` section inside the `staticValues` array.  
  
  
If you would like a variable value to be shared in multiple command blocks but be randomly generated, place the name you used for the variable inside the `globalRandomValues` array.  

