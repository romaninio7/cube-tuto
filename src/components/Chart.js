import React from "react";
import { Card, CardTitle, CardBody, CardText, Spinner } from "reactstrap";
import { QueryRenderer } from "@cubejs-client/react";

const Chart = ({ cubejsApi, title, query, render }) => (
  <Card>
    <CardBody>
      <CardTitle tag="h5">{title}</CardTitle>
      <CardText>
        <QueryRenderer
          query={query}
          cubejsApi={cubejsApi}
          render={({ resultSet }) => {
            if (!resultSet) {
              return (
                <div className="d-flex p-2 justify-content-center">
                  <Spinner type="grow" color="warning" children={false} />
                </div>
              );
            }

            return render(resultSet);
          }}
        />
      </CardText>
    </CardBody>
  </Card>
);

export default Chart;
