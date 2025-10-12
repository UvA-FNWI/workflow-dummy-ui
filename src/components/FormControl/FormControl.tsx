import {Button, Tabs} from "antd";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {PageControl} from "components/FormControl/PageControl.tsx";
import {useSetTitle} from "hooks/useTitles.ts";
import {useTranslate} from "hooks/useTranslate.ts";
import {endpoints} from "backend/endpoints.ts";

interface Props {
  instanceId: string
  submissionId: string
}

export const FormControl = ({ instanceId, submissionId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const { data } = endpoints.getSubmission.useQuery({ instanceId, submissionId });
  const [submitSubmission] = endpoints.submitSubmission.useMutation();
  const { l, t } = useTranslate();

  const navigate = useNavigate();
  const pages = data?.form.pages;
  const lastIndex = pages?.slice(-1)[0].index ?? -1;

  useSetTitle({ title: data?.form.title });

  const handleNext = async () => {
    if (activeTab === lastIndex) {
      setLoading(true);
      const res = await submitSubmission({instanceId, submissionId});
      setLoading(false);
      const invalid = res.data?.invalidQuestions;
      if (invalid) {
        alert(l({
          en: `Please enter valid values for ${invalid.map(m => `${m.questionName.en} (${m.validationError.en})}`).join(", ")}`,
          nl: `Geef geldige waardes op voor ${invalid.map(m => `${m.questionName.nl} (${m.validationError.nl})}`).join(", ")}`
        }));
        return;
      }
      navigate('..');
    }
    else {
      setActiveTab(activeTab + 1);
    }
  };

  return pages && <Tabs activeKey={activeTab.toString()}
                       onTabClick={k => setActiveTab(+k)}
                       tabBarStyle={pages.length === 1 ? { display: "none" } : undefined}
                       tabPosition={pages.length === 1 ? "top" : "left"} items={pages.map(p => ({
    label: l(p.title),
    key: p.index.toString(),
    children: <>
      <PageControl instanceId={instanceId}
                   submissionId={submissionId}
                   page={p}
                   last={p.index === lastIndex}
                   loading={loading}
                   next={handleNext} />
      { data.dateSubmitted && <div>
          <i>{t('saved')}</i>
          <div style={{ marginTop: "10px" }}><Button size="large" onClick={() => navigate("..")}>{t('back')}</Button></div>
      </div> }
    </>
  }))} />
}