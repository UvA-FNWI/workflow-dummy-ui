import {endpoints} from "backend/endpoints.ts";
import type {ScreenRow} from "backend/types.ts";
import type {Column} from "components/DataTable/Column.tsx";
import {DataTable} from "components/DataTable/DataTable.tsx";
import {useTranslate} from "hooks/useTranslate.ts";
import {Link} from "react-router-dom";
import {AnswerControl} from "components/AnswerControl/AnswerControl.tsx";

interface Props {
  entityType: string
  screen: string
}

export const ScreenTable = ({ entityType, screen }: Props) => {
  const {data, isLoading} = endpoints.getScreen.useQuery({entityType, screen});
  const { l } = useTranslate();

  if (isLoading) return <div><i>Loading...</i></div>;

  if (!data) return <div>Error!</div>;

  return <DataTable
    source={data.rows}
    columns={data.columns.map(
      (column) =>
        ({
          key: column.id.toString(),
          header: l(column.title),
          value: (row: ScreenRow) => {
            const value = row.values[column.id] as
              | string
              | number
              | null
              | undefined;
            return value;
          },
          render: (row: ScreenRow) => {
            const value = row.values[column.id]?.toString();
            const answerControl = <AnswerControl answer={{
              value,
              isVisible: true,
              questionName: "",
              files: [],
              id: ""
            }} type={column.dataType} />;
            return column.link ? <Link to={`/instances/${row.id}`}>{answerControl}</Link> : answerControl;
          }
        } satisfies Column<ScreenRow>)
    )}
  />
}