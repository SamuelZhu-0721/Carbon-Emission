const columnDragger = document.getElementById("columnDragger");
const mapArea = document.getElementById("mapArea");
const chartArea = document.getElementById("chartArea");

let initChartAreaWidth = chartArea.offsetWidth;
columnDragger.addEventListener("mousedown", function (e1) {
  let initWidth1 = mapArea.offsetWidth;
  let initWidth2 = chartArea.offsetWidth;
  function resize(e2) {
    e2.preventDefault();
    let deltaX = e2.clientX - e1.clientX;
    mapArea.style.flex = `0 0 ${initWidth1 + deltaX}px`;
    chartArea.style.flex = `0 0 ${initWidth2 - deltaX}px`;
    cesiumContainer.style.height = "96%";
    if (mapArea.offsetWidth < window.innerWidth / 2) {
      mapArea.style.flex = `0 0 ${window.innerWidth / 2}px`;
      chartArea.style.flex = `0 0 ${window.innerWidth / 2 - 65}px`;
      columnDragger.style.flex = `0 0 5px`;
      document.removeEventListener("mousemove", resize);
    }
    if (chartArea.offsetWidth < initChartAreaWidth) {
      chartArea.style.flex = `0 0 ${initChartAreaWidth}px`;
      mapArea.style.flex = `0 0 ${
        window.innerWidth - 65 - initChartAreaWidth
      }px`;
      columnDragger.style.flex = `0 0 5px`;
      document.removeEventListener("mousemove", resize);
    }
    moveTimelineSlider();
  }
  document.addEventListener("mousemove", resize);
  document.addEventListener("mouseup", function up() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", up);
  });
});
