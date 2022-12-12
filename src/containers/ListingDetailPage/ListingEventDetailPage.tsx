import React, { FC, Fragment, useState } from 'react';
import useWindowSize from 'hooks/useWindowResize';
import NcImage from 'shared/NcImage/NcImage';
import ModalPhotos from './ModalPhotos';
import SectionSubscribe2 from 'components/SectionSubscribe2/SectionSubscribe2';
import MobileFooterSticky from './MobileFooterSticky';
import { useHistory, useLocation } from 'react-router-dom';
import { decode, encode } from 'js-base64';
import { POST } from 'utils/apiHelper';
import { message } from 'utils/message';
import SectionGridFilterCard from 'containers/ListingDetailPage/SectionGridFilterCard';
import { getTitleWebsite } from 'utils/localStorage';
import { Helmet } from "react-helmet";

const getSrc = require('get-src');

export interface ListingEventDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const ListingEventDetailPage: FC<ListingEventDetailPageProps> = ({
  className = '',
  isPreviewMode,
}) => {
  const location = useLocation();
  const router = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [openFocusIndex, setOpenFocusIndex] = useState(0);
  const [tcsProduct, setTcsProduct] = useState<any>({});
  const [map, setMap] = React.useState<any>('');
  const [date, setDate] = React.useState('');
  const [person, setPerson] = React.useState<number>(0);
  const [galleryImgs, setGalleryImgs] = React.useState<any>([]);
  const [eventProduct, setEventProduct] = useState(null);

  const windowSize = useWindowSize();

  React.useEffect(() => {
    if (Object.keys(tcsProduct).length === 0) {
      getDetailTcsProduct();
    }
  }, [tcsProduct]);

  const handleToCheckout = () => {
    if (date === '' || person === 0) {
      message('error', 'Please fill field correctly');
    } else {
      let data = {
        date: date,
        person: person,
        cid: tcsProduct?.cid,
        merchantKey: tcsProduct?.merchantKey,
        name: tcsProduct?.name,
        tcVendorCode: tcsProduct?.tcVendorCode,
        hirarki: tcsProduct?.hirarki,
      };
      let dataToEncode = encode(JSON.stringify(data));
      router.push('/reservation', {
        data: dataToEncode,
      });
    }
  };

  const getDetailTcsProduct = () => {
    let data = decode(location.search.split('key=')[1]);
    let json: any = JSON.parse(data);
    let body = {
      eventCode: json.eventCode,
      hirarki: json.hirarki,
      eventStartDate: json.eventStartDate,
      eventEndDate: json.eventEndDate,
      isDisabled: 2,
    };
    setGalleryImgs(json?.imageGallery);
    setEventProduct(json);
    POST('/mevent-tcsdetail/list/index', body)
      .then((tcs) => {
        if (Object.keys(tcs.result).length > 0) {
          let product: any = [];
          tcs.result?.map((item: any) => {
            item?.eventDetailSchedule?.map((res: any) => {
              product.push({
                schedule: res,
                item: item,
              });
            });
          });
          setTcsProduct(product);
          let getMap = getSrc(json?.embedMap);
          setMap(getMap);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getDaySize = () => {
    if (windowSize.width <= 375) {
      return 34;
    }
    if (windowSize.width <= 500) {
      return undefined;
    }
    if (windowSize.width <= 1280) {
      return 56;
    }
    return 48;
  };

  const handleOpenModal = (index: number) => {
    setIsOpen(true);
    setOpenFocusIndex(index);
  };

  const handleCloseModal = () => setIsOpen(false);

  if (Object.keys(tcsProduct).length === 0) {
    return null;
  }

  return (
    <div
      className={`ListingDetailPage nc-ListingEventDetailPage ${className}`}
      data-nc-id="ListingEventDetailPage"
    >
      {/* SINGLE HEADER */}
      <Helmet>
        <title>{getTitleWebsite()} - Event Detail</title>
      </Helmet>
      <>
        <header className="container 2xl:px-14 rounded-md sm:rounded-xl">
          <div className="relative grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-2">
            <div
              className="col-span-2 row-span-3 sm:row-span-2 relative rounded-md sm:rounded-xl overflow-hidden cursor-pointer"
              onClick={() => handleOpenModal(0)}
            >
              <NcImage
                containerClassName="absolute inset-0"
                className="object-cover w-full h-full rounded-md sm:rounded-xl"
                src={galleryImgs?.length > 0 ? galleryImgs[0] : []}
              />
              <div className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity"></div>
            </div>
            {galleryImgs
              ?.filter((_: any, i: any) => i >= 1 && i < 5)
              .map((item: any, index: any) => (
                <div
                  key={index}
                  className={`relative rounded-md sm:rounded-xl overflow-hidden ${index >= 3 ? 'hidden sm:block' : ''
                    }`}
                >
                  <NcImage
                    containerClassName="aspect-w-4 aspect-h-3 sm:aspect-w-6 sm:aspect-h-5"
                    className="object-cover w-full h-full rounded-md sm:rounded-xl "
                    src={item || ''}
                  />

                  {/* OVERLAY */}
                  <div
                    className="absolute inset-0 bg-neutral-900 bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => handleOpenModal(index + 1)}
                  />
                </div>
              ))}

            <div
              className="absolute hidden md:flex md:items-center md:justify-center left-3 bottom-3 px-4 py-2 rounded-xl bg-neutral-100 text-neutral-500 cursor-pointer hover:bg-neutral-200 z-10"
              onClick={() => handleOpenModal(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                />
              </svg>
              <span className="ml-2 text-neutral-800 text-sm font-medium">
                Show all photos
              </span>
            </div>
          </div>
        </header>
        {/* MODAL PHOTOS */}
        <ModalPhotos
          imgs={galleryImgs?.length > 0 ? galleryImgs : []}
          isOpen={isOpen}
          onClose={handleCloseModal}
          initFocus={openFocusIndex}
          uniqueClassName="nc-ListingEventDetailPage-modalPhotos"
        />
      </>

      {/* MAIn */}
      <main className="container relative z-10 mt-11 flex flex-col lg:flex-row ">
        {/* CONTENT */}
        <div className="w-full space-y-8 lg:space-y-10 lg:pr-10">
          <SectionGridFilterCard
            eventMain={eventProduct}
            tcsProduct={tcsProduct}
            className="pb-16 lg:pb-28"
          />
        </div>
      </main>

      {/* OTHER SECTION */}
      {/* {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          <SectionSubscribe2 className="pt-24 lg:pt-32" />
        </div>
      )} */}
    </div>
  );
};

export default ListingEventDetailPage;
