const modePicker_3d = document.getElementById("modePicker_3d");
const modePicker_2_5d = document.getElementById("modePicker_2_5d");
const modePicker_2d = document.getElementById("modePicker_2d");

modePicker_3d.addEventListener("click", function () {
  console.log("111");
  modePicker_3d.style.display = "none";
  modePicker_2d.style.display = "block";
  viewer.scene.morphTo2D(1.5);
});
modePicker_2d.addEventListener("click", function () {
  modePicker_2d.style.display = "none";
  modePicker_2_5d.style.display = "block";
  viewer.scene.morphToColumbusView(1.5);
});
modePicker_2_5d.addEventListener("click", function () {
  modePicker_2_5d.style.display = "none";
  modePicker_3d.style.display = "block";
  viewer.scene.morphTo3D(1.5);
});



var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
handler.setInputAction(function (e) {
  var pick = viewer.scene.pick(e.position);
  //点击物体的属性都存在pick.id内部
  if (pick&&pick.id) {
    var area=area=pick.id._properties._SHAPE_AREA._value;
    //console.log(area)
    var cartographic=Cesium.Cartographic.fromCartesian(pick.primitive._actualPosition);
    var lat = Cesium.Math.toDegrees(cartographic.latitude);
    var lng = Cesium.Math.toDegrees(cartographic.longitude);
    var height=Cesium.Cartesian3.fromDegrees(lng,lat,area*100).z;
 
    viewer.camera.flyTo({
      destination:Cesium.Cartesian3.fromDegrees(lng, lat, height),   
    })
    
  }
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);
