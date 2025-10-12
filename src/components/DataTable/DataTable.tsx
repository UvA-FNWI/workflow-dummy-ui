import {type Column} from "components/DataTable/Column";
import {Button, Dropdown, Table} from "antd";
import {type CSSProperties, type ReactNode, useMemo} from "react";
import {type ColumnType} from "antd/es/table";
import {utils, writeFile} from "xlsx";

interface Props<T> {
  source: T[];
  columns: Column<T>[];
  summary?: () => ReactNode;
  rowKey?: string;
  exports?: Export<T>[];
  pagination?: boolean;
  minimal?: boolean;
  style?: CSSProperties
}

export interface Export<T> {
  fileName: string;
  title: string;
  mimeType: 'text/csv' | 'text/tex' | 'application/vnd.ms-excel' | 'application/pdf';
  action: (source: T[], columns: Column<T>[]) => void;
}

export const CsvExport = <T,>(fileName: string): Export<T> => ({
  fileName: fileName + ".csv",
  title: "Comma-separated",
  mimeType: "text/csv",
  action: (s,c) => downloadExport(generateCsv(s, c), fileName + ".csv")
});

export const ExcelExport = <T,>(fileName: string): Export<T> => ({
  fileName: fileName + ".xlsx",
  title: "Excel",
  mimeType: "application/vnd.ms-excel",
  action: (s,c) => generateExcel(s, c, fileName + ".xlsx")
});

export const PdfExport = <T,>(url: string): Export<T> => ({
  fileName: url,
  title: "PDF",
  mimeType: "application/pdf",
  action: () => { window.location.href = url; }
})

function generateCsv<T>(source: T[], columns: Column<T>[]) {
  const rows = [
    columns.map(c => `"${c.key}"`).join(','),
    ...source.map(t =>
      columns.map(c => '"' + (c.value?.(t) ?? '').toString() + '"').join(',')
    )
  ];
  return rows.join('\n');
}

function generateExcel<T>(source: T[], columns: Column<T>[], fileName: string) {
  const data = source.map(t => columns.map(c => c.value?.(t)));
  const headers = columns.map(c => c.key);
  const ws = utils.aoa_to_sheet([headers, ...data]);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, "Export");
  writeFile(wb, fileName);
}

function downloadExport(content: string, fileName: string) {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
}

export function DataTable<T extends object>(
  { source, columns, summary, rowKey = "id", style, exports = [], pagination = false, minimal = false }: Props<T>
) {

  const mappedColumns = useMemo(() => columns.filter(c => !c.hide).map<ColumnType<T>>(c => {
    const val = c.value ?? (() => "");
    return {
      title: c.header ?? c.key,
      key: c.key,
      filters: c.filter ? Array.from(new Set(source.map(a => val(a)).filter(a => a))).map(p => ({ text: p, value: p! })) : undefined,
      onFilter: c.filter ? ((f,a) => val(a) === f) : undefined,
      render: c.render ?? (a => val(a)?.toString()),
      width: c.width,
      sorter: c.sorter ?? c.value ? ((a,b) => typeof(val(a)) === "number" ? (val(a) ?? 0) as number - ((val(b) ?? 0) as number)
        : (val(a)?.toString().localeCompare(val(b)?.toString() ?? "")) ?? 0) : undefined
    };
  }), [columns, source]);

  return <>
    { !!exports?.length && !!source.length &&
      <Dropdown
          menu={{ items: exports.map(e => ({
            label: e.title,
            key: e.mimeType,
            onClick: () => e.action(source, columns)
          })) }}>
          <Button type="link" style={{ float: "right" }}>Export</Button>
      </Dropdown>
    }
    <Table dataSource={source} rowKey={rowKey}
           style={style}
           columns={mappedColumns}
           expandable={{ defaultExpandAllRows: true }}
           pagination={pagination ? { defaultPageSize: 50 } : false}
           summary={summary}
           bordered={!minimal}
           size={minimal ? "small" : undefined}
    />
  </>
}