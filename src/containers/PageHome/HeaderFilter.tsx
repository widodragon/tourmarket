import React, { FC, useEffect, useState } from 'react';
import Heading from 'shared/Heading/Heading';
import Nav from 'shared/Nav/Nav';
import NavItem from 'shared/NavItem/NavItem';
import ButtonSecondary from 'shared/Button/ButtonSecondary';
import { ReactNode } from 'react';
import { useHistory } from 'react-router-dom';

export interface HeaderFilterProps {
  tabActive: string;
  tabs: string[];
  heading: ReactNode;
  subHeading?: ReactNode;
  onClickTab: (item: string) => void;
}

const HeaderFilter: FC<HeaderFilterProps> = ({
  tabActive,
  tabs,
  subHeading = '',
  heading = '🎈 Latest Articles',
  onClickTab,
}) => {
  const [tabActiveState, setTabActiveState] = useState(tabActive);
  const router = useHistory();
  useEffect(() => {
    setTabActiveState(tabActive);
  }, [tabActive]);

  const handleClickTab = (item: string) => {
    onClickTab && onClickTab(item);
    setTabActiveState(item);
  };

  return (
    <div className="flex flex-col mb-8 relative">
      <Heading desc={subHeading}>{heading}</Heading>
      <div className="flex items-center justify-between">
        <Nav
          className="sm:space-x-2"
          containerClassName="relative flex w-full overflow-x-auto text-sm md:text-base hiddenScrollbar"
        >
          {tabs.map((item, index) => (
            <NavItem
              key={index}
              isActive={tabActiveState === item}
              onClick={() => handleClickTab(item)}
            >
              {item}
            </NavItem>
          ))}
        </Nav>
        <span className="sm:block flex-shrink-0">
          <ButtonSecondary
            className="!leading-none"
            onClick={() =>
              router.push('/listing-view', {
                tabActive: tabActiveState,
              })
            }
          >
            <span>Lihat semua</span>
            <i className="ml-3 las la-arrow-right text-xl"></i>
          </ButtonSecondary>
        </span>
      </div>
    </div>
  );
};

export default HeaderFilter;
