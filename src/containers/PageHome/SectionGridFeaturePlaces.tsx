import { FC, ReactNode, useState } from 'react';
import { TcsProductType } from 'data/types';
import HeaderFilter from './HeaderFilter';
import StayCard from 'components/StayCard/StayCard';
export interface SectionGridFeaturePlacesProps {
  stayListings?: TcsProductType[];
  tcsEvent?: TcsProductType[];
  gridClass?: string;
  heading?: ReactNode;
  subHeading?: ReactNode;
  headingIsCenter?: boolean;
  tabs?: string[];
}

const SectionGridFeaturePlaces: FC<SectionGridFeaturePlacesProps> = ({
  stayListings,
  tcsEvent,
  gridClass = '',
  heading = 'Kunjungi event yang akan digelar',
  subHeading = '',

  tabs = ['Wisata', 'Event'],
}) => {
  const [tabPosition, setTabPosition] = useState('Wisata');
  const renderCard = (stay: TcsProductType) => {
    return <StayCard key={stay.id} data={stay} />;
  };
  return (
    <div className="nc-SectionGridFeaturePlaces relative">
      <HeaderFilter
        tabActive={'Wisata'}
        subHeading={subHeading}
        tabs={tabs}
        heading={
          tabPosition === 'Wisata' ? 'Kunjungi destinasi wisata' : heading
        }
        onClickTab={(data) => setTabPosition(data)}
      />
      {/* <SectionGridFilterCard className="pb-24 lg:pb-28" /> */}
      <div
        className={`grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${gridClass}`}
      >
        {tabPosition === 'Wisata'
          ? stayListings?.map((stay) => renderCard(stay))
          : tcsEvent?.map((stay) => renderCard(stay))}
      </div>
      {/* <div className="flex mt-16 justify-center items-center">
        <ButtonPrimary loading>Show me more</ButtonPrimary>
      </div> */}
    </div>
  );
};

export default SectionGridFeaturePlaces;
