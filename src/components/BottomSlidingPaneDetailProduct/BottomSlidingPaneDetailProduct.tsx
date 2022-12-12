import { FC, useState } from 'react';
import Sheet from 'react-modal-sheet';
import { useHistory } from 'react-router-dom';
import { encode } from 'js-base64';

import StayDatesRangeInput from 'components/HeroSearchForm/StayDatesRangeInput';
import GuestsInput from 'components/HeroSearchForm/GuestsInput';
import ButtonPrimary from 'shared/Button/ButtonPrimary';
import { message } from 'utils/message';

export interface BottomSlidingPaneDetailProductProps {
  className?: string;
  isOpen: boolean;
  onClose: VoidFunction;
  tcsProducts: any;
}

const BottomSlidingPaneDetailProduct: FC<
  BottomSlidingPaneDetailProductProps
> = ({ className = '', isOpen, onClose, tcsProducts }) => {
  const router = useHistory();
  const [date, setDate] = useState('');
  const [person, setPerson] = useState<number>(0);

  const handleToCheckout = () => {
    if (date === '' || person === 0) {
      message('error', 'Please fill field correctly');
    } else {
      let data = {
        date: date,
        person: person,
        cid: tcsProducts.cid,
        merchantKey: tcsProducts.merchantKey,
        name: tcsProducts.name,
        tcVendorCode: tcsProducts.tcVendorCode,
        hirarki: tcsProducts.hirarki,
      };
      let dataToEncode = encode(JSON.stringify(data));
      router.push('/reservation', {
        data: dataToEncode,
      });
    }
  };

  const renderHeader = () => {
    return (
      <div className="m-3">
        <p className="text-base font-body text-center text-black">
          Silahkan masukan tanggal dan jumlah pengunjung
        </p>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className="mt-1 mx-4">
        <form className="flex flex-col border border-neutral-200 dark:border-neutral-700 rounded-3xl">
          <StayDatesRangeInput
            wrapClassName="divide-x divide-neutral-200 dark:divide-neutral-700 !grid-cols-1 sm:!grid-cols-2"
            onChange={(date: any) => setDate(date)}
            fieldClassName="p-3"
            defaultValue={null}
            anchorDirection={'right'}
            className="nc-ListingStayDetailPage__stayDatesRangeInput flex-1"
          />
          <div className="w-full border-b border-neutral-200 dark:border-neutral-700"></div>
          <GuestsInput
            className="nc-ListingStayDetailPage__guestsInput flex-1"
            fieldClassName="p-3"
            defaultValue={{
              person: 0,
            }}
            onChange={(data) => setPerson(Number(data.person))}
            hasButtonSubmit={false}
          />
        </form>

        {/* SUBMIT */}
        <ButtonPrimary
          className="mt-3 w-full"
          onClick={() => handleToCheckout()}
        >
          Reserve
        </ButtonPrimary>
      </div>
    );
  };

  return (
    <Sheet
      rootId="root"
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[700, 550, 100, 0]}
      initialSnap={0}
    >
      <Sheet.Container>
        <Sheet.Header />
        <Sheet.Header>{renderHeader()}</Sheet.Header>

        <Sheet.Content>{renderContent()}</Sheet.Content>
      </Sheet.Container>

      <Sheet.Backdrop />
    </Sheet>
  );
};

export default BottomSlidingPaneDetailProduct;
