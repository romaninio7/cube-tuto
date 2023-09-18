import React, { useCallback } from "react";
import { Card, CardTitle, CardBody, CardText } from "reactstrap";
import "bootstrap-daterangepicker/daterangepicker.css";
import DateRangePicker from "react-bootstrap-daterangepicker";

const DateRangeFilter = ({ range, handleRange }) => {
  const { start, end } = range;

  const label = start.format("MMM D, YYYY") + " - " + end.format("MMM D, YYYY");

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Date Range filter</CardTitle>
        <CardText>
          <DateRangePicker
            onCallback={handleRange}
            initialSettings={{
              startDate: start.toDate(),
              endDate: end.toDate(),
            }}
          >
            <div
              id="reportrange"
              className="col-4"
              style={{
                background: "#fff",
                cursor: "pointer",
                padding: "5px 10px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <span>{label}</span>
            </div>
          </DateRangePicker>
        </CardText>
      </CardBody>
    </Card>
  );
};

export default DateRangeFilter;
