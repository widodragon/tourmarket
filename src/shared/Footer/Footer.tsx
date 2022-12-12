import Logo from 'shared/Logo/Logo';
import SocialsList1 from 'shared/SocialsList1/SocialsList1';
import { CustomLink } from 'data/types';
import React, { useEffect, useState } from 'react';
import { CONFIG_STR } from 'contains/contants';
import { getStorage } from 'utils/localStorage';
import Policy from 'shared/Policy/Policy';
const getSrc = require('get-src');

export interface WidgetFooterMenu {
  id: string;
  title: string;
  menus: CustomLink[];
}

const Footer: React.FC = () => {
  const [map, setMap] = useState<any>(null);

  useEffect(() => {
    let config = getStorage(CONFIG_STR);
    if (config) {
      let getMap = getSrc(config.embedMap);
      setMap(getMap);
    }
  }, []);

  return (
    <div className="nc-Footer relative py-24 lg:py-15 border-t border-neutral-200 dark:border-neutral-700">
      <div className="flex flex-col md:flex-row md:mx-24 justify-center item-center">
        <div className="flex flex-row mr-10 w-full">
          <div className="flex lg:flex w-full flex-row lg:flex-col mb-6 justify-center item-center">
            <div className="w-[30%] flex-row md:col-span-1">
              <Logo />
            </div>
            <div className="col-span-2 flex space-x-3 items-center md:col-span-3">
              <SocialsList1 className="flex items-center space-x-3 lg:space-x-0 lg:flex-col lg:space-y-2.5 lg:items-start" />
            </div>
            <Policy className="mt-2 ml-2 lg:ml-0 hidden sm:flex flex-col justify-center items-start space-y-1" />
          </div>
        </div>
        <Policy className="self-center sm:hidden -mt-3 mb-3 flex flex-col justify-center items-center space-y-1" />
        <div className="flex flex-row justify-end w-[100%]">
          <iframe
            title="Dolan Dolin Map"
            className="w-full"
            src={map}
            height="100%"
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default Footer;
