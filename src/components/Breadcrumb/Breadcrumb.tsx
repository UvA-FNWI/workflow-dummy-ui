import {Link, useMatches} from "react-router-dom";
import {useEffect} from "react";
import {extractTitle, useAddTitle, useTitles} from "hooks/useTitles.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import {endpoints} from "backend/endpoints.ts";

interface Props {
  baseUrl?: string;
}

export const Breadcrumb = ({ baseUrl = "/" }: Props) => {
  const matches = useMatches();
  const titles = useTitles();
  const addTitle = useAddTitle();
  const { l, t } = useTranslate();

  const instanceId = matches[2]?.pathname.split('/')[2];
  const { data } = endpoints.getInstance.useQuery({ id: instanceId }, { skip: !instanceId || `/instances/${instanceId}` in titles });
  if (!(`/instances/${instanceId}` in titles) && data) {
    console.log("add title", `/instances/${instanceId}`, extractTitle(data));
    addTitle(`/instances/${instanceId}`, extractTitle(data));
  }

  const format = (match: { pathname: string } ) => {
    if (match.pathname === "/instances") return l(titles[`/instances/${instanceId}`]?.parent) ?? t("instances");
    if (match.pathname === "/") return t("main");
    const title = l(titles[match.pathname]?.title);
    return title && title.length > 0 ? title : t("unknown");
  }

  const filtered = matches.filter((m,i) => !m.pathname.endsWith("/") || i === 0);
  const last = format(filtered[filtered.length - 1]);

  useEffect(() => { document.title = last; }, [last]);

  return <div> { filtered.map((m,i) => <span key={m.id}>
    { i === filtered.length - 1 && <span>{format(m)}</span>}
    { i < filtered.length - 1 && <>
      { i === 0 ? <a href={baseUrl}>{format(m)}</a> : <Link to={m.pathname}>{format(m)} </Link> }
        <span style={{ fontSize: 11, paddingRight: 5, paddingLeft: 5, color: '#aaa' }}>►</span>
    </> }
  </span>) } </div>
}