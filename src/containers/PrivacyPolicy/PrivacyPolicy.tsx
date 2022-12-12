import { CONFIG_STR } from 'contains/contants';
import { FC, useState, useEffect } from 'react';
import { getStorage, getTitleWebsite } from 'utils/localStorage';
import { Helmet } from "react-helmet";

const PrivacyPolicy: FC = () => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    let configData = getStorage(CONFIG_STR);
    if (configData) {
      setConfig(configData);
    }
  }, []);

  const renderContent = () => (
    <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-8 px-3 p-2 xl:p-6">
      <p className="text-lg lg:text-3xl font-semibold">Kebijakan Pribadi</p>
      <p className="text-center text-sm lg:text-lg">{config?.about}</p>
    </div>
  );

  return (
    <main className="container mt-11 mb-24 lg:mb-32 ">
      <Helmet>
        <title>{getTitleWebsite()} - Privacy Policy</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </main>
  );
};

export default PrivacyPolicy;
