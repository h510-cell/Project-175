var modelList = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var models = await this.getModels();

    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      elementsArray.push({ model_name: modelName, barcode_value: barcodeValue });

      // Changing Model Visiblity
      models[barcodeValue]["models"].map(item => {
        var models = document.querySelector(`#${item.model_name}-${barcodeValue}`);
        models.setAttribute("visible", false);
      });

    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelList.findIndex(x => x.model_name === modelName);
      if (index > -1) {
        modelList.splice(index, 1);
      }
    });
},


  tick: async function () {
    if (modelList.length > 1) {

      var messageText = document.querySelector("#message-text");

      var isBaseModelPresent = this.isModelPresentInArray(modelList,"base");
      var distance = null;

      if(!isBaseModelPresent){
        messageText.setAttribute("visible",true)
      } else{
        if(models === null){
          var models = this.getModels();
        }

        messageText.setAttribute("visible",false)
        this.placeTheModel("road",models)
        this.placeTheModel("car",models)
        this.placeTheModel("building1",models)
        this.placeTheModel("building2",models)
        this.placeTheModel("building3",models)
        this.placeTheModel("tree",models)
        this.placeTheModel("sun",models)
      }
    }
  },

  getDistance: function(elA, elB){
    return elA.object3d.position.distanceTo(elB.object3d.position)
  },

  getModelGeometry: function(models,modelName){
    var barcodes = Object.keys(models)
    for(var barcode of barcodes){
      if(models[barcode].model_name === modelName){
        return{
          position:models[barcode]["placement_position"],
          rotation:models[barcode]["placement_rotation"],
          scale:models[barcode]["placement_scale"],
          model_url:models[barcode]["model_url"]
        }
      }
    }

    },

    placeTheModel: function(modelName,models){
      var isListContainModel = this.isModelPresentInArray(modelList,modelName)
      if(isListContainModel){
        var distance = null;
        var marker1 = document.querySelector(`marker-base`)
        var marker2 = document.querySelector(`#marker-${modelName}`)

        distance = this.getDistance(marker1,marker2);
        if(distance < 1.25) {
          var modelEl = document.querySelector(`#${modelName}`)
          modelEl.setAttribute("visible",false)

          var isModelPlaced = document.querySelector(`#model-${modelName}`)
          if(isModelPlaced === null) {
            var el = document.createElement("a-entity")
            var modelGeometry = this.getModelGeometry(models,modelName)

            el.setAttribute("id",`model-${modelName}`)
            el.setAttribute("gltf-model",`url(${modelGeometry.model_url})`);
            el.setAttribute("position",modelGeometry.position)
            el.setAttribute("rotation",modelGeometry.rotation)
            el.setAttribute("scale",modelGeometry.scale)
            marker1.appendChild(el)
          }
        }
      }
    },

    isModelPresentInArray: function(arr, val){
      for(var i of arr){
        if(i in model_name === val){
          return true;
        }
      }
      return false;
    },

    getModels: function () {
      // NOTE: Use ngrok server to get json values
      return fetch("js/model.json")
        .then(res => res.json())
        .then(data => data);
    },

})