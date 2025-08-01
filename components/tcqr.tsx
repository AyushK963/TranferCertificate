// components/TCQRCode.tsx
import { QRCodeCanvas } from 'qrcode.react';

export const TCQRCode = ({ tcId }: { tcId: string }) => {
  const verifyURL = `https://tranfer-certificate.vercel.app/verify/${tcId}`;
  return (
    <div className="mt-4 text-center">
      <QRCodeCanvas value={verifyURL} size={100} />
    </div>
  );
};
