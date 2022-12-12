import Heading from 'components/Heading/Heading';
import { FC, useEffect, useState } from 'react';
import NcImage from 'shared/NcImage/NcImage';
import HIW1img from 'images/HIW1.png';
import HIW2img from 'images/HIW2.png';
import HIW3img from 'images/HIW3.png';
import VectorImg from 'images/VectorHIW.svg';
import { getStorage } from 'utils/localStorage';
import { CONFIG_STR } from 'contains/contants';

export interface SectionHowItWorkProps {
  className?: string;
  data?: {
    id: number;
    title: string;
    desc: string;
    img: string;
    imgDark?: string;
  }[];
}

const DEMO_DATA: SectionHowItWorkProps['data'] = [
  {
    id: 1,
    img: HIW1img,
    title: 'Book & relax',
    desc: 'Let each trip be an inspirational journey, each room a peaceful space',
  },
  {
    id: 2,
    img: HIW2img,
    title: 'Smart checklist',
    desc: 'Let each trip be an inspirational journey, each room a peaceful space',
  },
  {
    id: 3,
    img: HIW3img,
    title: 'Save more',
    desc: 'Let each trip be an inspirational journey, each room a peaceful space',
  },
];

const SectionHowItWork: FC<SectionHowItWorkProps> = ({
  className = '',
  data = DEMO_DATA,
}) => {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    getConfig();
  }, []);

  const getConfig = async () => {
    let configData = await getStorage(CONFIG_STR);
    if (configData) {
      setConfig(configData);
    }
  };

  return (
    <div
      className={`nc-SectionHowItWork  ${className}`}
      data-nc-id="SectionHowItWork"
    >
      <Heading isCenter desc={''}>
        Kenapa harus
        <img
          src={config?.imageLogo[0]}
          alt="logo dolan dolin"
          className="h-24 w-24 mx-3"
        />
        ?
      </Heading>
      <div>
        <img
          className="hidden md:block absolute inset-x-0 top-10"
          src={VectorImg}
          alt=""
        />
        <NcImage containerClassName="w-full" src={config?.imageHowItWorks[0]} />
      </div>
    </div>
  );
};

export default SectionHowItWork;
