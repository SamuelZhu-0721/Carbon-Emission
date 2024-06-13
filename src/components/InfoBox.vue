<template>
  <div id="infoBox">
    <h2>InfoBox Title</h2>
    <a-table id="f" :dataSource="totalData" :columns="columns" size="middle" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      totalData: [],
      currCountry: "CHINA",
      columns: [
        {
          title: "年份",
          dataIndex: "year",
          key: "year",
        },
        {
          title: "总和",
          dataIndex: "total",
          key: "total",
        },
        {
          title: "人均",
          dataIndex: "avg",
          key: "avg",
        },
      ],
    };
  },
  mounted() {
    this.loadGeoJson();
  },
  methods: {
    loadGeoJson() {
      fetch("/data/total.geojson")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const temp = data.features;
          console.log(temp);
          let thisCountryProperties = null;
          for (let i = 0; i < temp.length; i++) {
            if (temp[i].properties.NAME === this.currCountry) {
              thisCountryProperties = temp[i].properties;
              break;
            }
          }
          if (!thisCountryProperties) {
            alert("该国数据缺失！");
          } else {
            console.log(thisCountryProperties);
            for (let i = 1970; i <= 2020; i++) {
              const newData = {
                key: i - 1969,
                year: i,
                total: Number(thisCountryProperties[`F${i}`]).toFixed(2),
                avg: Number(thisCountryProperties[`F${i}`]).toFixed(2),
              };
              console.log(newData);
              this.totalData.push(newData);
            }
            console.log(this.totalData);
          }
        })
        .catch((error) =>
          console.error("Error loading the geojson data: ", error)
        );
    },
  },
};
</script>

<style scoped>
#infoBox {
  position: absolute;
  right: 10px;
  z-index: 100;
  top: 10%;
  width: 500px;
  /* max-height: 80%; */
  text-align: center;
  font-family: Arial, sans-serif;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 2px 5px #0000001a;
}
#infoBox h2 {
  margin-top: 0;
  color: #333;
}
#infoBox p {
  color: #666;
}
:deep() .ant-table-thead > tr > th {
  background-color: #c7dcfb; /* 更改表头背景色 */
}
/* #showTable {
  height: 100%;
} */

/* .ant-table-wrapper {
} */
</style>
