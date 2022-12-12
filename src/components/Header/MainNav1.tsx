import React, { FC } from "react";
import Logo from "shared/Logo/Logo";
import Navigation from "shared/Navigation/Navigation";
import NavigationItem from "../../shared/Navigation/NavigationItem";
import SearchDropdown from "./SearchDropdown";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import MenuBar from "shared/MenuBar/MenuBar";
import ncNanoId from "../../utils/ncNanoId";
import SwitchDarkMode from "shared/SwitchDarkMode/SwitchDarkMode";
import HeroSearchForm2MobileFactory from "components/HeroSearchForm2Mobile/HeroSearchForm2MobileFactory";
import { deleteLocalStorage, deleteUserStorage, isLogin, setEmailLocalStorage, setLogin } from "utils/localStorage";
import { useHistory } from 'react-router-dom';
import AvatarDropdown from "./AvatarDropdown";
import {
  ArrowRightOnRectangleIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import { CONFIG_TCS } from "contains/contants";

export interface MainNav1Props {
  className?: string;
}
const History = {
  id: ncNanoId(),
  href: "/history",
  name: "Riwayat Transaksi",
  isNew: false,
};

const MainNav1: FC<MainNav1Props> = ({ className = "" }) => {
  const location = useHistory()
  const [login, setLoginData] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (isLogin()) {
      setLoginData(isLogin());
    }
  }, [isLogin()]);

  const handleLogout = () => {
    setEmailLocalStorage("");
    deleteLocalStorage(CONFIG_TCS);
    deleteUserStorage();
    setLogin(false);
    setLoginData(false);
    location.push("/login");
  }

  const handleProfile = () => {
    location.push("/account");
  }

  const solutionsFoot = [
    // {
    //   name: "Help",
    //   href: "##",
    //   icon: LifebuoyIcon,
    //   onClick: () => { }
    // },

    {
      name: "Logout",
      href: "##",
      icon: ArrowRightOnRectangleIcon,
      onClick: () => handleLogout()
    },
  ];

  return (
    <div className={`nc-MainNav1 relative z-10 ${className}`}>
      <div className="px-4 lg:container py-4 lg:py-5 relative flex justify-between items-center">
        <div className="hidden md:flex justify-start flex-1 items-center space-x-4 sm:space-x-10">
          <Logo />
          <Navigation />
          {
              login ? <NavigationItem key={History.id} menuItem={History} /> : null
            }

        </div>

        <div className="lg:hidden flex-[3] max-w-lg !mx-auto md:px-3">
          <HeroSearchForm2MobileFactory />
        </div>

        <div className="hidden md:flex flex-shrink-0 items-center justify-end flex-1 lg:flex-none text-neutral-700 dark:text-neutral-100">
          <div className="hidden xl:flex items-center space-x-0.5">
            {/* <SwitchDarkMode /> */}
            {/* <SearchDropdown /> */}
            <div className="px-1" />
            {
              login ? <AvatarDropdown solutionsFoot={solutionsFoot} /> :
                <ButtonPrimary href="/login">Sign up</ButtonPrimary>
            }
          </div>
          <div className="flex xl:hidden items-center">
            {/* <SwitchDarkMode /> */}
            <div className="px-0.5" />
            <MenuBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainNav1;
