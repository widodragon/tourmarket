import React, { FC } from 'react';
import { getStorage } from 'utils/localStorage';
import { CONFIG_STR } from 'contains/contants';
import { Link } from 'react-router-dom';

export interface PolicyProps {
  className?: string;
}

const Policy: FC<PolicyProps> = ({ className = 'space-y-2.5' }) => {
  const [policies, setPolicies] = React.useState<any[]>([]);
  React.useEffect(() => {
    let config = getStorage(CONFIG_STR);
    if (config) {
      setPolicies([
        {
          name: 'Kebijakan Pribadi',
          path: '/privacy-policy',
        },
        {
          name: 'Syarat Penggunaan',
          path: '/term-of-use',
        },
        {
          name: 'Layanan Pengguna',
          path: '/contact-support',
        },
      ]);
    }
  }, []);
  const renderItem = (item: any, index: number) => {
    return (
      <Link to={item.path}>
        <span
          key={index}
          className="md:block text-sm font-body text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
        >
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <div className={`nc-Policy ${className}`} data-nc-id="Policy">
      {policies.map(renderItem)}
    </div>
  );
};

export default Policy;
