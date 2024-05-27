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
