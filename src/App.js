import React, { useCallback, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import moment from "moment";
import numeral from "numeral";
import cubejs from "@cubejs-client/core";
import Chart from "./components/Chart.js";
import DateRangeFilter from "./components/DateRangeFilter.js";

const styles = {
  row: {
    marginBottom: 24,
  },
};

const dateFormat = "YYYY-MM-DD";
const initialEndDate = "01-01-2020";

const cubejsApi = cubejs(process.env.REACT_APP_CUBEJS_TOKEN, {
  apiUrl: process.env.REACT_APP_API_URL,
});
const numberFormatter = (item) => numeral(item).format("0,0");
const dateFormatter = (item) => moment(item).format("MMM YY");

const renderSingleValue = (resultSet, key) => (
  <h1 height={300}>{numberFormatter(resultSet.chartPivot()[0][key])}</h1>
);

const App = () => {
  const [range, setRange] = useState({
    start: moment(initialEndDate).subtract(1, "year"),
    end: moment(initialEndDate),
  });

  const handleRange = useCallback((start, end) => {
    setRange({ start, end });
  }, []);

  return (
    <Container fluid>
      <Row style={styles.row}>
        <Col>
          <DateRangeFilter range={range} handleRange={handleRange} />
        </Col>
      </Row>
      <Row style={styles.row}>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Users"
            query={{
              measures: ["Users.count"],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [
                    moment(range.start).format(dateFormat),
                    moment(range.end).format(dateFormat),
                  ],
                },
              ],
            }}
            render={(resultSet) => renderSingleValue(resultSet, "Users.count")}
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Total Orders"
            query={{
              measures: ["Orders.count"],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [
                    moment(range.start).format(dateFormat),
                    moment(range.end).format(dateFormat),
                  ],
                },
              ],
            }}
            render={(resultSet) => renderSingleValue(resultSet, "Orders.count")}
          />
        </Col>
        <Col sm="4">
          <Chart
            cubejsApi={cubejsApi}
            title="Shipped Orders"
            query={{
              measures: ["Orders.count"],
              filters: [
                {
                  dimension: "Orders.status",
                  operator: "equals",
                  values: ["shipped"],
                },
              ],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [
                    moment(range.start).format(dateFormat),
                    moment(range.end).format(dateFormat),
                  ],
                },
              ],
            }}
            render={(resultSet) => renderSingleValue(resultSet, "Orders.count")}
          />
        </Col>
      </Row>

      <Row style={styles.row}>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="New Users Over Time"
            query={{
              measures: ["Users.count"],
              timeDimensions: [
                {
                  dimension: "Users.createdAt",
                  dateRange: [
                    moment(range.start).format(dateFormat),
                    moment(range.end).format(dateFormat),
                  ],
                  granularity: "month",
                },
              ],
            }}
            render={(resultSet) => (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={resultSet.chartPivot()}>
                  <XAxis dataKey="category" tickFormatter={dateFormatter} />
                  <YAxis tickFormatter={numberFormatter} />
                  <Tooltip labelFormatter={dateFormatter} />
                  <Area
                    type="monotone"
                    dataKey="Users.count"
                    name="Users"
                    stroke="rgb(255, 88, 52)"
                    fill="rgba(255, 88, 52, .56)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          />
        </Col>
        <Col sm="6">
          <Chart
            cubejsApi={cubejsApi}
            title="Orders by Status Over time"
            query={{
              measures: ["Orders.count"],
              dimensions: ["Orders.status"],
              timeDimensions: [
                {
                  dimension: "Orders.createdAt",
                  dateRange: [
                    moment(range.start).format(dateFormat),
                    moment(range.end).format(dateFormat),
                  ],
                  granularity: "month",
                },
              ],
            }}
            render={(resultSet) => {
              return (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={resultSet.chartPivot()}>
                    <XAxis tickFormatter={dateFormatter} dataKey="x" />
                    <YAxis tickFormatter={numberFormatter} />
                    <Bar
                      stackId="a"
                      dataKey="shipped, Orders.count"
                      name="Shipped"
                      fill="#7D00FF"
                    />
                    <Bar
                      stackId="a"
                      dataKey="processing, Orders.count"
                      name="Processing"
                      fill="#FF4500"
                    />
                    <Bar
                      stackId="a"
                      dataKey="completed, Orders.count"
                      name="Completed"
                      fill="#007C78"
                    />
                    <Legend />
                    <Tooltip />
                  </BarChart>
                </ResponsiveContainer>
              );
            }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
