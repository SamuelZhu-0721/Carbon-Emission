let currDataSource = null;
//点击加载数据
document.getElementById("totalCarbon").onclick = function () {
  //let currDataSource = null;
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/total_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("buildings").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/buildings_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("industry").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/industry_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("transport").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/transport_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("energySystem").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load(
    "../src/data_point/energy_system_point.geojson",
    {}
  )
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("AFOLU").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/AFOLU_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("perCarbon").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load(
    "../src/data_point/per_carbon_point.geojson",
    {}
  )
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("cleanEnergy").onclick = function () {
  alert("请选择具体的清洁能源");
};
document.getElementById("wind").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/wind_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("solar").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/solar_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("nuclear").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/nuclear_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};
document.getElementById("hydro").onclick = function () {
  viewer.dataSources.removeAll();
  Cesium.GeoJsonDataSource.load("../src/data_point/hydro_point.geojson", {})
    .then(function (dataSource) {
      currDataSource = dataSource;
      addData();
    })
    .catch((e) => {
      console.log(error);
    });
};

function normalize1(value) {
  return value / 1;
}
function normalize2(value) {
  return (value - 1) / (10 - 1);
}
function normalize3(value) {
  return (value - 10) / (100 - 10);
}
function normalize4(value) {
  return (value - 100) / (600 - 100);
}
function normalize5(value) {
  return (value - 600) / (2924.99103722 - 600);
}

// addData
function addData() {
  if (!currDataSource) console.log("nodata");
  viewer.dataSources.add(currDataSource);
//   currDataSource.clustering.enabled = true;
//   currDataSource.clustering.pixelRange = 20; //聚合距离，小于这个距离会被融合
//   currDataSource.clustering.minimumClusterSize = 2; //每个聚合点的最小个数
  let entities = currDataSource.entities.values;
  // 在加载时遍历得到当前数据所有国家，储存各个年份的最小值和最大值
  for (let i = 0; i < entities.length; i++) {
    for (let j = 1970; j <= 2020; j++) {
      const value = entities[i].properties[`_F${j}`]._value;
      if (value < minValueArray[j - 1970]) {
        minValueArray[j - 1970] = value;
      } else if (value > maxValueArray[j - 1970]) {
        maxValueArray[j - 1970] = value;
      }
    }
    entities[i].billboard = undefined;
    let area = entities[i].properties.SHAPE_AREA.getValue();
    //根据国家面积大小设置了两个归一化标准，但呈现效果一般，小国比较多
    if (area < 1) {
      entities[i].point = new Cesium.PointGraphics({
        pixelSize: 5 + normalize1(area) * 10,
        color: new Cesium.Color(1, 0, 0, 0.5),
        outlineWidth: 1,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      });
    } else if (area < 10) {
      entities[i].point = new Cesium.PointGraphics({
        pixelSize: 15 + normalize2(area) * 10,
        color: new Cesium.Color(1, 0, 0, 0.5),
        outlineWidth: 1,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      });
    } else if (area < 100) {
      entities[i].point = new Cesium.PointGraphics({
        pixelSize: 25 + normalize3(area) * 10,
        color: new Cesium.Color(1, 0, 0, 0.5),
        outlineWidth: 1,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      });
    } else if (area < 600) {
      entities[i].point = new Cesium.PointGraphics({
        pixelSize: 35 + normalize4(area) * 10,
        color: new Cesium.Color(1, 0, 0, 0.5),
        outlineWidth: 1,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      });
    } else {
      entities[i].point = new Cesium.PointGraphics({
        pixelSize: 45 + normalize5(area) * 10,
        color: new Cesium.Color(1, 0, 0, 0.5),
        outlineWidth: 1,
        outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
      });
    }
    // if (area>662.855357002) {
    //     entities[i].point = new Cesium.PointGraphics({
    //         pixelSize: 25+normalize1(area)*30,
    //         color: new Cesium.Color(1,0,0,0.5),
    //         outlineWidth: 1,
    //         outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
    //       });
    // } else {
    //     entities[i].point = new Cesium.PointGraphics({
    //         pixelSize: 5+normalize2(area)*20,
    //         color: new Cesium.Color(1,0,0,0.8),
    //         outlineWidth: 1,
    //         outlineColor: Cesium.Color.fromCssColorString("#ffffff"),
    //       });
    // }
    currDataSource.clustering.clusterEvent.addEventListener(function (
      clusteredEntities,
      cluster
    ) {
      // 关闭自带的显示聚合数量的标签
      cluster.label.show = false;
      cluster.billboard.show = true;
      cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
    });
  }
  // changeStyle();
}
