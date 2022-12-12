import BottomSlidingPaneReserve from 'components/BottomSlidingPaneReserve/BottomSlidingPaneReserve';
import { FC, useState } from 'react';

import styles from './Reservation.module.css';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
export interface MobileReserveStickyProps {
  productSelected: any[];
  bookingDate: string;
}

const MobileReserveSticky: FC<MobileReserveStickyProps> = ({
  productSelected,
  bookingDate,
}) => {
  const [openBottomPanel, setOpenBottomPane] = useState<boolean>(false);

  return (
    <div className="block lg:hidden fixed bottom-0 inset-x-0 py-2 sm:py-3 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-6000 z-20">
      <div className="container flex flex-row items-center justify-between space-x-2">
        <ButtonPrimary
          children={<p>Lihat detail pesanan</p>}
          className={`w-full ${styles.reservationButtonActionsMobile}`}
          type="button"
          onClick={() => {
            setOpenBottomPane(true);
          }}
        />
        <ButtonPrimary
          children={<p>Reserve</p>}
          className={`w-full ${styles.reservationButtonActionsMobile}`}
          type="submit"
        />
      </div>

      <BottomSlidingPaneReserve
        isOpen={openBottomPanel}
        onClose={() => setOpenBottomPane(false)}
        productSelected={productSelected}
        bookingDate={bookingDate}
      />
    </div>
  );
};

export default MobileReserveSticky;
