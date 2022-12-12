import { FC } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export interface QrCodeProps {
  className?: string;
  qrValue: string;
}

const QrCode: FC<QrCodeProps> = ({ className = '', qrValue }) => {
  return <QRCodeSVG value={qrValue} size={250} style={{ margin: 'auto' }} />;
};

export default QrCode;
