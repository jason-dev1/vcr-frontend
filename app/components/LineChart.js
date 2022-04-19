import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLegend,
  VictoryLine,
  VictoryTheme,
  VictoryZoomContainer,
} from "victory-native";

const { height: HEIGHT, width: WIDTH } = Dimensions.get("window");

function LineChart({ data, lines = [], title, legendWidth }) {
  const [chartWidth, setChartWidth] = useState(350);
  const [chartHeight, setChartHeight] = useState(350);

  const legends = [];

  lines.forEach(({ color, name }) => {
    legends.push({
      name: name,
      symbol: { fill: color, type: "minus" },
    });
  });

  return (
    <View
      onLayout={(event) => {
        var { width, height } = event.nativeEvent.layout;
        setChartHeight(height);
        setChartWidth(width);
      }}
    >
      <VictoryChart
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryZoomContainer responsive={true} zoomDimension="x" />
        }
      >
        <VictoryLabel
          text={title}
          x={(WIDTH - 35) / 2}
          y={20}
          textAnchor="middle"
        />
        {lines.map(({ color, x, y }) => (
          <VictoryLine
            data={data}
            interpolation="natural"
            key={y}
            sortOrder="descending"
            style={{
              data: { stroke: color, strokeWidth: "2" },
              parent: { border: "1px solid #ccc" },
            }}
            x={x}
            y={y}
          />
        ))}
        <VictoryLegend
          data={legends}
          gutter={20}
          orientation="horizontal"
          titleOrientation="bottom"
          x={(chartWidth - legendWidth) / 2}
          y={325}
        />

        <VictoryAxis fixLabelOverlap></VictoryAxis>
        <VictoryAxis
          dependentAxis
          fixLabelOverlap
          tickFormat={(t) => {
            if (t > Math.pow(10, 3) && t < Math.pow(10, 6))
              return `${t / Math.pow(10, 3)}k`;
            else if (t > Math.pow(10, 6)) return `${t / Math.pow(10, 6)}m`;
          }}
        ></VictoryAxis>
      </VictoryChart>
    </View>
  );
}

export default LineChart;
