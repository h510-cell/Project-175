AFRAME.registerComponent("city_design", {
    init: async function () {
  
      //Get the compund details of the element
      var models = await this.getModels();
  
      var barcodes = Object.keys(models);
  
      barcodes.map(barcode => {
        var model = models[barcode];

        this.createModels(model);
      });
  
    },
    getModels: function () {
      return fetch("js/model.json")
        .then(res => res.json())
        .then(data => data);
    },
    createModels: async function (model) {
      
      var modelsName = model.model_name;
      var barcodeValue = model.barcode_value;

      var scene = document.querySelector("a-scene");
  
      //Add marker entity for BARCODE marker
      var marker = document.createElement("a-marker");
  
      marker.setAttribute("id", `marker-${barcodeValue}`);
      marker.setAttribute("type", "barcode");
      marker.setAttribute("model_name", modelsName);
      marker.setAttribute("value", barcodeValue);
      marker.setAttribute("markerhandler", {});
      scene.appendChild(marker);

      if(barcodeValue === 0 ) {
          var modelEl = document.createElement("a-entity")
          modelEl.setAttribute("id",`${modelsName}`)
          modelEl.setAttribute("geometry",{
              primtive : "box",
              width: model.width,
              height: model.height
          })
          modelEl.setAttribute("position", model.position)
          modelEl.setAttribute("rotation", model.rotation)
          modelEl.setAttribute("material",{
              color: model.color
          })
          marker.appendChild(modelEl)
      } else {
        var modelEl = document.createElement("a-entity")
        modelEl.setAttribute("id",`${modelsName}`)
        modelEl.setAttribute("gltf-model",`url(${modelUrl})`)
        modelEl.setAttribute("scale", model.scale)
        modelEl.setAttribute("position", model.position)
        modelEl.setAttribute("rotation", model.rotation)
        marker.appendChild(modelEl)
    }
}
})