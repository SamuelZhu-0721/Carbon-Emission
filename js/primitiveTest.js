
// 下面是加载面数据尝试
// const totalCo2Path = "../src/data/total.geojson";
// $.get(totalCo2Path, function (data) {
//   const features = data.features;
//   addDataToGlobe(features);
// });

// const totalCo2 = [];
// function addDataToGlobe(features) {
//   for (let i = 0; i < features.length; i++) {
//     const feature = features[i];
//     for (let j = 0; j < feature.geometry.coordinates.length; j++) {
//       const polygonArr = feature.geometry.coordinates[j].toString().split(",");
//       const polygon = new Cesium.PolygonGeometry({
//         polygonHierarchy: new Cesium.PolygonHierarchy(
//           Cesium.Cartesian3.fromDegreesArray(polygonArr)
//         ),
//         vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,
//       });
//       const geometry = Cesium.PolygonGeometry.createGeometry(polygon);
//       const geometryInstance = new Cesium.GeometryInstance({
//         geometry: geometry,
//         attributes: {
//           color: Cesium.ColorGeometryInstanceAttribute.fromColor(
//             Cesium.Color.fromRandom({ alpha: 0.7 })
//           ),
//         },
//         id: feature.properties,
//       });
//       totalCo2.push(geometryInstance);
//     }
//   }
//   console.log(totalCo2);
// }

// const primitiveTotal = new Cesium.Primitive({
//   geometryInstances: totalCo2,
//   appearance: new Cesium.PerInstanceColorAppearance({
//     translucent: true,
//     closed: false,
//   }),
//   asynchronous: false, // 确定基元是异步创建还是阻塞直到准备就绪
// });
// viewer.scene.primitives.add(primitiveTotal);

// const tempButton = document.getElementById('star');
// tempButton.addEventListener('click',function(){
//   console.log('button clicked');
//   viewer.scene.primitives.add(primitiveTotal);
// })

