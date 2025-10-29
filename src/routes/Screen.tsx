import { endpoints } from "backend/endpoints";
import { DataTable } from "components/DataTable/DataTable";
import { useParams } from "react-router-dom";
import { useTranslate } from "hooks/useTranslate";
import type { ScreenRow } from "backend/types";
import type { Column } from "components/DataTable/Column";

export const Screen = () => {
  const { entityType, screen } = useParams();
  const { l } = useTranslate();

  if (!entityType || !screen) {
    return <div>Invalid parameters</div>;
  }

  const { data } = endpoints.getScreen.useQuery({ entityType, screen });

  if (!data) {
    return <div>No data found</div>;
  }

  return (
    <div>
      <DataTable
        source={data.rows}
        columns={data.columns.map(
          (column) =>
            ({
              key: column.id.toString(),
              header: l(column.title),
              value: (row: ScreenRow) => {
                console.log("row", row, column);
                const value = row.values[column.id] as
                  | string
                  | number
                  | null
                  | undefined;
                return value;
              },
            } satisfies Column<ScreenRow>)
        )}
      />
    </div>
  );
};
