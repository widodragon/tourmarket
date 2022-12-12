import { FC, useState } from 'react';
import BottomSlidingPaneDetailProduct from 'components/BottomSlidingPaneDetailProduct/BottomSlidingPaneDetailProduct';
import ButtonPrimary from 'shared/Button/ButtonPrimary';

export interface MobileFooterStickyProps {
  tcsProducts?: any;
}

const MobileFooterSticky: FC<MobileFooterStickyProps> = ({ tcsProducts }) => {
  const [openBottomPanel, setOpenBottomPane] = useState<boolean>(false);

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-20">
      <div className="container">
        <ButtonPrimary
          children={<p>Reserve</p>}
          className="w-full h-32"
          onClick={() => setOpenBottomPane(true)}
        />
      </div>
      <BottomSlidingPaneDetailProduct
        isOpen={openBottomPanel}
        onClose={() => setOpenBottomPane(false)}
        tcsProducts={tcsProducts!}
      />
    </div>
  );
};

export default MobileFooterSticky;
