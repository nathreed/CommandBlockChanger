var NbtWriter = require("node-nbt").NbtWriter;
var TAG = require("node-nbt").TAG;
var fs = require("fs");

exports.valueForKey = function(mapMetaInfo, key, globalValues) {
	var returnValue;
		//First we see if we should apply a random value to it (that will be more common than a static value)
		mapMetaInfo.values.randomValues.forEach(function (randomVal) {
			if(randomVal == key) {
				//We have determined that we should generate a random 8-digit identifier for this
				var id = "";
				var possibleValues = "abcdefghijklmnopqrstuvwxyz0123456789";
				for(var i = 0; i<8; i++) {
					id += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
				}
				//console.log("ID generated successfully");
				returnValue = id;
				//console.log("key ", key, " required random id so one was generated.");
			}
		});

		//Having not found it in the random values, we will look it up in the static array
		mapMetaInfo.values.staticValues.forEach(function (staticVal) {
			if(staticVal.key == key) {
				//We have found the static value to apply
				returnValue = staticVal.replaceWith;
				//console.log("Static value found successfully.")
				//console.log("Key ", key, "required a static id and it was found")
			}
		});

		//Having not found it in the random or the static values, we will look it up in the global values array.
		mapMetaInfo.values.globalRandomValues.forEach(function (globalVal) {
			if(globalVal == key) {
				//We have found the global value.
				if(!globalValues[key]) {
					//It doesn't already exist in our list of global values
					//We should generate the random id for it
					var id = "";
					var possibleValues = "abcdefghijklmnopqrstuvwxyz0123456789";
					for(var i = 0; i<8; i++) {
						id += possibleValues.charAt(Math.floor(Math.random() * possibleValues.length));
					}
					globalValues[key] = id;
					//console.log("The key did not exist so it was created.")
					returnValue = {value: id, updatedGlobalRandomVals: globalValues};
					//console.log(globalValues);
				} else {
					//console.log("The key already existed and it was returned")
					returnValue = {value: globalValues[key], updatedGlobalRandomVals: globalValues};
					//console.log(globalValues);
				}
				//console.log("Key ", key, " required a global random value so it was generated and saved.")
			}
		})
		//If we have not returned yet we should return undefined and log that this was so
		//console.log("Unable to find the specified key in either the randomValues or the staticValues area.");
		return returnValue;
}
exports.getIndexTrackers = function(levelTag) {
	//console.log("Get index trackers.");
			var LightPopulatedIndex;
			var zPosIndex;
			var HeightMapIndex;
			var SectionsIndex;
			var LastUpdateIndex;
			var VIndex;
			var BiomesIndex;
			var InhabitedTimeIndex;
			var xPosIndex;
			var TerrainPopulatedIndex;
			var TileEntitiesIndex;
			var EntitiesIndex;
			var TileTicksIndex;

			var levelTagIndexTracker = 0;
			var maxLevelTagIndexTracker;
			//console.log("Reached index tracker")
			levelTag.forEach(function (item) {
				//console.log(item.name);
				if(item.name == "LightPopulated") {
					LightPopulatedIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created LightPopulated index");
				} else if(item.name == "zPos") {
					zPosIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created zPos index");
				} else if(item.name == "HeightMap") {
					HeightMapIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created HeightMapIndex");
				} else if(item.name == "Sections") {
					SectionsIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created SectionsIndex");
				} else if(item.name == "LastUpdate") {
					LastUpdateIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created LastUpdateIndex");
				} else if(item.name == "V") {
					VIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created VIndex");
				} else if(item.name == "Biomes") {
					BiomesIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created BiomesIndex");
				} else if(item.name == "InhabitedTime") {
					InhabitedTimeIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created InhabitedTimeIndex");
				} else if(item.name == "xPos") {
					xPosIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created xPosIndex");
				} else if(item.name == "TerrainPopulated") {
					TerrainPopulatedIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created TerrainPopulatedIndex");
				} else if(item.name == "TileEntities") {
					TileEntitiesIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created TileEntitiesIndex");
				} else if(item.name == "Entities") {
					EntitiesIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created EntitiesIndex");
				} else if(item.name == "TileTicks") {
					TileTicksIndex = levelTagIndexTracker;
					levelTagIndexTracker++;
					//console.log("Created TileTicksIndex");
				}
				maxLevelTagIndexTracker = levelTagIndexTracker;
				
			});


			
			if(!TileTicksIndex) { //It did not get set because it did not exist
					//console.log("No TileTicks tag was found")
					TileTicksIndex = maxLevelTagIndexTracker;
					//console.log("Set tileticksindex to " + TileTicksIndex);
					levelTag.splice(maxLevelTagIndexTracker, 0, {val: {list: []}})
					//console.log(levelTag[TileTicksIndex]);
				}

			var IndexTrackers = {
				LightPopulated: LightPopulatedIndex,
				zPos: zPosIndex,
				HeightMap: HeightMapIndex,
				Sections: SectionsIndex,
				LastUpdate: LastUpdateIndex,
				V: VIndex,
				Biomes: BiomesIndex,
				InhabitedTime: InhabitedTimeIndex,
				xPos: xPosIndex,
				TerrainPopulated: TerrainPopulatedIndex,
				TileEntities: TileEntitiesIndex,
				Entities: EntitiesIndex,
				TileTicks: TileTicksIndex
			}

			return IndexTrackers;
}
exports.writeLevelTag = function (levelTag) {
	var indexes = exports.getIndexTrackers(levelTag);

	var dataToWrite = {
						type: TAG.COMPOUND,
						name: '',
						val: [
							{
								name: 'Level',
								type: TAG.COMPOUND,
								val: [
									{type: TAG.BYTE, name: "LightPopulated", val: levelTag[indexes["LightPopulated"]].val},
									{type: TAG.INT, name:"zPos", val:levelTag[indexes["zPos"]].val},
									{type: TAG.INTARRAY, name:"HeightMap", val:levelTag[indexes["HeightMap"]].val},
									{type: TAG.LIST, name:"Sections", val:levelTag[indexes["Sections"]].val},
									{type: TAG.LONG, name:"LastUpdate", val:levelTag[indexes["LastUpdate"]].val},
									{type: TAG.BYTE, name:"V", val:levelTag[indexes["V"]].val},
									{type: TAG.BYTEARRAY, name:"Biomes", val:levelTag[indexes["Biomes"]].val},
									{type: TAG.LONG, name:"InhabitedTime", val:levelTag[indexes["InhabitedTime"]].val},
									{type: TAG.INT, name:"xPos", val:levelTag[indexes["xPos"]].val},
									{type: TAG.BYTE, name:"TerrainPopulated", val:levelTag[indexes["TerrainPopulated"]].val},
									{type: TAG.LIST, name:"TileEntities", val:levelTag[indexes["TileEntities"]].val},
									{type: TAG.LIST, name:"Entities", val:levelTag[indexes["Entities"]].val},
									{type: TAG.LIST, name:"TileTicks", val:levelTag[indexes["TileTicks"]].val}
									//levelTag[11], //The Entities tag
								]
							}
						]
					};

	return NbtWriter.writeTag(dataToWrite);

}
exports.deleteFolderRecursive = function(path) {
	if( fs.existsSync(path) ) {
    fs.readdirSync(path).forEach(function(file,index){
      var curPath = path + "/" + file;
      if(fs.lstatSync(curPath).isDirectory()) { // recurse
        exports.deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}