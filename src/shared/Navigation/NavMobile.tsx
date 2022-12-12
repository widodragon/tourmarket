import React from 'react';
import ButtonClose from 'shared/ButtonClose/ButtonClose';
import Logo from 'shared/Logo/Logo';
import { Disclosure } from '@headlessui/react';
import { NavLink, useHistory } from 'react-router-dom';
import { NavItemType } from './NavigationItem';
import { NAVIGATION_DEMO } from 'data/navigation';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import {
  getStorage,
  isLogin,
  setEmailLocalStorage,
  setLogin,
} from 'utils/localStorage';
import { CONFIG_STR } from 'contains/contants';

export interface NavMobileProps {
  data?: NavItemType[];
  onClickClose?: () => void;
}

const NavMobile: React.FC<NavMobileProps> = ({
  data = NAVIGATION_DEMO,
  onClickClose,
}) => {
  const location = useHistory();
  const [login, setLoginData] = React.useState<boolean>(false);
  const [config, setConfig] = React.useState<any>(null);
  React.useEffect(() => {
    if (isLogin() && !config) {
      let configData = getStorage(CONFIG_STR);
      if (configData) {
        setConfig(configData);
      }
      setLoginData(isLogin());
    }
  }, [isLogin(), config]);

  const handleLogout = () => {
    setEmailLocalStorage('');
    setLogin(false);
    setLoginData(false);
    location.push('/login');
  };
  const handleProfile = () => {
    location.push('/account');
  };

  const _renderMenuChild = (item: NavItemType) => {
    return (
      <ul className="nav-mobile-sub-menu pl-6 pb-1 text-base">
        {item.children?.map((i, index) => (
          <Disclosure key={i.href + index} as="li">
            <NavLink
              exact
              strict
              to={{
                pathname: i.href || undefined,
              }}
              className="flex px-4 text-neutral-900 dark:text-neutral-200 text-sm font-medium rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 mt-0.5"
              activeClassName="text-secondary"
            >
              <span
                className={`py-2.5 pr-3 ${!i.children ? 'block w-full' : ''}`}
              >
                {i.name}
              </span>
              {i.children && (
                <span
                  className="flex-1 flex"
                  onClick={(e) => e.preventDefault()}
                >
                  <Disclosure.Button
                    as="span"
                    className="py-2.5 flex justify-end flex-1"
                  >
                    <ChevronDownIcon
                      className="ml-2 h-4 w-4 text-neutral-500"
                      aria-hidden="true"
                    />
                  </Disclosure.Button>
                </span>
              )}
            </NavLink>
            {i.children && (
              <Disclosure.Panel>{_renderMenuChild(i)}</Disclosure.Panel>
            )}
          </Disclosure>
        ))}
      </ul>
    );
  };

  const _renderItem = (item: NavItemType, index: number) => {
    return (
      <Disclosure
        key={item.id}
        as="li"
        className="text-neutral-900 dark:text-white"
      >
        <NavLink
          exact
          strict
          className="flex w-full px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          to={{
            pathname: item.href || undefined,
          }}
          activeClassName="text-secondary"
        >
          <span
            className={`py-2.5 pr-3 ${!item.children ? 'block w-full' : ''}`}
          >
            {item.name}
          </span>
          {item.children && (
            <span className="flex-1 flex" onClick={(e) => e.preventDefault()}>
              <Disclosure.Button
                as="span"
                className="py-2.5 flex items-center justify-end flex-1 "
              >
                <ChevronDownIcon
                  className="ml-2 h-4 w-4 text-neutral-500"
                  aria-hidden="true"
                />
              </Disclosure.Button>
            </span>
          )}
        </NavLink>
        {item.children && (
          <Disclosure.Panel>{_renderMenuChild(item)}</Disclosure.Panel>
        )}
      </Disclosure>
    );
  };

  return (
    <div className="overflow-y-auto w-full h-screen py-2 transition transform shadow-lg ring-1 dark:ring-neutral-700 bg-white dark:bg-neutral-900 divide-y-2 divide-neutral-100 dark:divide-neutral-800">
      <div className="py-6 px-5">
        <Logo />
        <div className="flex flex-col mt-5 text-neutral-700 dark:text-neutral-300 text-sm">
          <span>{config?.websiteSubHeader}</span>
        </div>
        <span className="absolute right-2 top-2 p-1">
          <ButtonClose onClick={onClickClose} />
        </span>
      </div>
      <ul className="flex flex-col py-6 px-2 space-y-1">
        {data.map(_renderItem)}
        {
          login &&
          <li
            onClick={handleLogout}
            className="flex w-full px-4 font-medium uppercase tracking-wide text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          >
            Logout
          </li>
        }
      </ul>
    </div>
  );
};

export default NavMobile;
