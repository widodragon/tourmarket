import { CONFIG_STR } from 'contains/contants';
import { FC, useState, useEffect } from 'react';
import { getStorage, getTitleWebsite } from 'utils/localStorage';
import { Helmet } from "react-helmet";

const ContactSupport: FC = () => {
  const [config, setConfig] = useState<any>({});

  useEffect(() => {
    let configData = getStorage(CONFIG_STR);
    if (configData) {
      setConfig(configData);
    }
  }, []);

  const renderContent = () => (
    <div className="w-full flex flex-col items-center justify-center rounded-2xl border border-neutral-200 dark:border-neutral-700 space-y-8 px-3 p-2 xl:p-6">
      <p className="text-center text-lg lg:text-3xl font-semibold">
        Butuh bantuan atau mengalami kendala ?
      </p>
      <p className="text-center text-sm lg:text-lg">{config.contactSupport}</p>
      <div className="flex flex-col lg:flex-row items-center justify-center">
        <span className="ml-1 text-sm lg:text-base">Email</span>
        <span className="ml-1 text-sm lg:text-base font-medium">
          {config.email} |{' '}
        </span>
        <span className="ml-1 text-sm lg:text-base">No Telp</span>
        <span className="ml-1 text-sm lg:text-base font-medium">
          {config.phone}
        </span>
      </div>
    </div>
  );

  return (
    <main className="container mt-11 mb-24 lg:mb-32 ">
      <Helmet>
        <title>{getTitleWebsite()} - Contact Support</title>
      </Helmet>
      <div className="max-w-4xl mx-auto">{renderContent()}</div>
    </main>
  );
};

export default ContactSupport;
