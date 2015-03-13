var MCAManager = require("mca.js");
var NbtReader = require("node-nbt").NbtReader;
var NbtWriter = require("node-nbt").NbtWriter;
var TAG = require("node-nbt").TAG;
var fs = require("fs");
var utils = require("./utils.js");

var blockChangeQueue = [];
var mapMetaInfo = JSON.parse(fs.readFileSync("map.mapmeta", "utf8"));
var globalRandomValues = [];

//Set up the block change queue
mapMetaInfo.changes.forEach(function (item) {
	var newObjectForQueue = {
		type: "blockChange", //Currently unused.
		x: item.x,
		y: item.y,
		z: item.z,
		Command: item.Command
	}

	blockChangeQueue.push(newObjectForQueue);
});
//console.log(blockChangeQueue);
var worldPath = process.argv[2];
function next() {
	if(blockChangeQueue[0]) {
		//console.log(blockChangeQueue[0]);
		var xOfChunk = Math.floor(blockChangeQueue[0].x/16);
		var zOfChunk = Math.floor(blockChangeQueue[0].z/16);
		var regionX = xOfChunk >> 5;
		var regionZ = zOfChunk >> 5;
		//var regionFolderPath = "/Users/nathan/Library/Application Support/minecraft/saves/Test NBT World Parsing/region/";
		var regionFolderPath = worldPath + "region/"
		var regionFileName = "r." + regionX + "." + regionZ + ".mca";
		var fullRegionFilePath = regionFolderPath + regionFileName;

		var readManager = new MCAManager(fullRegionFilePath);
		readManager.read(xOfChunk,zOfChunk,function(err, chunk) {
			if(err) {
				console.log(err)
			} else {
				var levelTag = NbtReader.readTag(chunk).val[0].val;

				//Replace the command
				var commandString = blockChangeQueue[0].Command;
				var variableInString = commandString.split("%")[1];
				var valueOfVariable = utils.valueForKey(mapMetaInfo, variableInString, globalRandomValues);
				var valueForCommandString;
				//Checking if we got updated global random values in addition to our value
				if(valueOfVariable.updatedGlobalRandomVals) {
					globalRandomValues = valueOfVariable.updatedGlobalRandomVals;
				}
				if(valueOfVariable.value) {
					valueForCommandString = valueOfVariable.value;
				} else {
					valueForCommandString = valueOfVariable;
				}

				//Right about here would be where the value needs to get stored somewhere for later retrieval

				var newCommandForBlockToModify = commandString.replace("%" + variableInString + "%", valueForCommandString);

				var IndexTrackers = utils.getIndexTrackers(levelTag);

				levelTag[IndexTrackers.TileEntities].val.list.forEach(function (item) {
					//console.log("Tile entities for each");
					if(item.val[0].name == "CustomName") {
						if(item.val[2].val == blockChangeQueue[0].x && item.val[3].val == blockChangeQueue[0].y && item.val[4].val == blockChangeQueue[0].z) {
							item.val[1].val = newCommandForBlockToModify;
						}//End if correct command block
					}//End if command block
				}) //End looping through tile entities

				//console.log(levelTag);

				//Write to file
				var writtenLevelData = utils.writeLevelTag(levelTag);
				var writeManager = new MCAManager(fullRegionFilePath);
				writeManager.write(xOfChunk,zOfChunk, writtenLevelData, function(err) {
					if(err) {
						console.log(err);
					} else {
						//console.log("Written successfully")
						blockChangeQueue.shift(); //Remove the element we have just been working on from the queue, we are done with it.
						next(); //Run the entire process again.
					} //end if write error
				}) //End writeManager callback


			} //End if error for readManager callback
		}); //End readManager.read callback

	} //End first if
} //End function

next(); //Jump-start.