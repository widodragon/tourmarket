import { FC } from 'react';
import Sheet from 'react-modal-sheet';
import convertNumbThousand from 'utils/convertNumbThousand';

export interface BottomSlidingPaneReserveProps {
  className?: string;
  isOpen: boolean;
  onClose: VoidFunction;
  productSelected: any[];
  bookingDate: string;
}

const BottomSlidingPaneReserve: FC<BottomSlidingPaneReserveProps> = ({
  className = '',
  isOpen,
  onClose,
  productSelected,
  bookingDate,
}) => {
  const renderHeader = () => {
    return (
      <div className="m-3">
        <p className="text-base font-body text-center text-black">
          Berikut merupakan detail pesanan anda
        </p>
      </div>
    );
  };

  const renderContent = () => {
    let getTotalPrice = 0;
    let getTotalServicePrice = 0;
    productSelected?.map((item: any) => {
      item?.productSelected?.map((res: any) => {
        getTotalPrice += res?.total;
        getTotalServicePrice += res?.item?.serviceFee;
      });
    });

    return (
      <div className="w-full flex flex-col sm:rounded-2xl lg:border border-neutral-200 dark:border-neutral-700 space-y-6 sm:space-y-8 px-0 sm:p-6 xl:p-8">
        <div className="flex flex-col space-y-4 mx-5">
          <div className="flex flex-row items-center justify-between">
            <p>Tanggal booking</p>
            <p>{bookingDate}</p>
          </div>
          {productSelected?.map((item: any, index: any) => {
            return (
              <>
                <h3 className="text-xl font-semibold">
                  Pengunjung {index + 1}
                </h3>
                {item?.productSelected?.map((res: any) => {
                  if (res.value > 0) {
                    return (
                      <>
                        <div className="flex justify-between text-neutral-6000 dark:text-neutral-300">
                          <span>
                            {res?.item?.productName} x {res?.value}
                          </span>
                          <span>
                            Rp{' '}
                            {convertNumbThousand(
                              res?.value * res?.item?.b2cPrice
                            )}
                          </span>
                        </div>
                      </>
                    );
                  }
                })}
              </>
            );
          })}
          <div className="border-b border-neutral-200 dark:border-neutral-700"></div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>Rp {convertNumbThousand(getTotalPrice)}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Sheet
      rootId="root"
      isOpen={isOpen}
      onClose={onClose}
      snapPoints={[700, 300, 100, 0]}
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

export default BottomSlidingPaneReserve;
