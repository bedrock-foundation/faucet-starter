import React from 'react';
import styled from '@emotion/styled';
import { GeistUIThemes, Loading, useTheme } from '@geist-ui/core';
import { QRCode as ReactQRCode } from 'react-qrcode-logo';

type ContainerProps = {
  theme: GeistUIThemes;
  isLoading: boolean;
  size?: number;
};

const Container = styled.div<ContainerProps>`
  box-sizing: border-box;
  padding: 16px;
  width: ${(props) => (props.size ? `${props.size}px` : '368px')};
  height: ${(props) => (props.size ? `${props.size}px` : '368px')};
  background-color: ${(props) =>
    props.isLoading
      ? props.theme.palette.background
      : props.theme.palette.accents_8};
  border: 1px solid ${(props) => props.theme.palette.accents_2};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export type QRCodeProps = {
  value: string;
  size?: number;
};

const base64Logo =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAZQSURBVHgB7d19TFVlHAfw7zn3CEddcpshb75cY4IvBWgJadkQknIzRVNBTJvOl2JtMS1db5r1R60207/aWkFa/kExBLXUnGGIbyAvtmpqoNxEjYnbZei82OWeznN8mZXcC5d7OM9z9/tsjHt4nj/Y/e487/ceCf+hKGo6bLZsDd45EiQHiBkaNA0NXbJ3E9zu5nsLpLuv7Ha7cuPvjYBWANJ/vNqnnsHh78PlcrHLW4EYYdys0F+lgFih3jMwLIOFYmNXimb7UP+VDWKVGPmmJ9zr9eyXoKoORZPPg1hNQ5c3w2aTw7ZIEjVVHJAgyy5Z70SSQbigQZsjKeGDNBBeaDIIVygQzlAgnKFAOEOBcIYC4QwFwhkKhDMUCGcoEM5QIJyhQDhDgXCGAuEMBcIZCoQzFAhnKBDOUCCcoUA4Q4FwRoFJns2agYSEBASqs9MNt9uNlouX4Gx24uKli/p1J0KdaYEsXDAfS5e8iGBpbW1Fs9OJI0ePobR0J05U1yAUCdNkRUVFIS01FWsKXkNV5SE01NYgb1EuQo2wfciECeOxrehL7PvhewwdOhShQvhOPTMjHeWlJSETSkiMstLSUrH5k48RCkJm2JuXl6v3MZMhOtNGWf7U1NajpHxPt+UDbDbExkTj0UfGY/KkiVDVcPgzb+5c4UdflgVytrEJn31e2KO6sTEx+OiDd5E9a6bPevPmZmP9m29BZEI0WZcuX8bSFfnGXeWLwzEKdnsERCZUH7KjuMRvHXuEHSKzrMkKRNXREwhUclISZs9+vtvyXbt349SpX+5ex8XFYvmyZUh/ehpS9cGCqqrweDxoampCYdE2bN6yFWYQKpDwcP8de3dSUpKw4Z379y+apsHpbDYCURQFm97bYKwIsNf3Ytdsfc6m2GAWoQIZP87/YuXl1r8QqMjISOzdswvJyUk+67W3t8MsQvUhL+Xl+Cyvra1DZ4ArwooyoEdhMGfOnIVZhLhDBg8ajPxVy/DU1Cd81iv+zn+nfz+SJCH/ldVGP9MTp0MxkIghQ/Q3OM1nHXvEEIxLTEBezgLEjx7ls25bWxuKir5CoHoaBuvY2VaAWSwLZNbMLOMnGK5du65PCN+Gy8S2/Q4zmytGqE79flyudqx9Yx22f/0NgoXdBT9XVqK2rl4f5p4zrhk2FL6uh28moQM5UV2NFxbkBrUJ+aOxEYsWL/nXnKQ/Cb3a+9ikScbcIlh7IRdaWjA9M8uyMBihA2ETtVUrV+Dgj/swdmwi+oJNDte+vt7UDrsnQmI/hG3nHti/F6MdDgTK6XRiZ1kZrGZZH+K80ILDR475rBMXG6PPQQZhzJh42PVhMpsvdCc6KgpFhV/gmazn7nbCvXHa5NFTT1kWSNXR48gvWNejuqq+hpWXMx8Fr66GY+SIbus9OXWKsSfybQATRF7OfAnRZLk7O1G4fQeyc5YYeyO+sBm3yITqQ86dd6K4pNxnncTERKFPoAjXqfvbpHpIDyNueBxEJVwgrPny58EIcbdx6fQ7Z4QLJGpYpN867NS8qIQLZErq4z7LWRjNzj8hKqECiY4aZmxU+cKWx61e/ugL7gNhk/OBqooZGek4VrHPODTnS21dHURm2Ux95IjhWJw7v9tye8QDUAeEIyY2GpnT0/3uGN5RWmr9elRfWBbINH1/fJqfPfLeOnmyFvsPHIDIQmbYe+XKFWNjSXQhEUhHxzWsXPWy8RlE0Qm9hcs2lRqbmrAwZxF+/e13hAIh7xAWREdHBwrWrMXktKkhEwZj2h3CHrnA3rhgYRM+tqt3vLoGZTvLcLCiold7GOx/Ceb/YxbTHlfBNovi4+PRF+yc1dW2q8YhOPa6LxM+tizf3Ufebh22dqLycBUsptHzQ/hCzw/hDQXCGQqEMxQIZygQzlAgnKFAOEOBcIYC4QwFwhkKhDMUCGcoEM5QIJyhQDhDgXCGAuEMBcIZCoQzFAhnKBDOyBq0ZhA+aGiQJcjlIFzQgAZJUdV0aHIFiNU0j+R92Ob1eJplJYx9+3BwP6xBekO/OaSt3s4bxbe/zcVuV8Ju/gQJE0H6Gzs5Wu8ZGJYJl8t1+xuB3W5v1+BiWfGq+gX7ZkoJpD8Yd4YexnIWBvvD/994VXXYvPJGvSBZL00BCTo2sjUGU1JXucftPnRv2T/f5fDSg4ix7QAAAABJRU5ErkJggg==';

const QRCode = React.forwardRef<any, QRCodeProps>(({ value, size }, ref) => {
  /** Actions */
  const theme = useTheme();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const qrSize: number = size ? size - 32 : 340;

  /* Render */
  return (
    <Container theme={theme} isLoading={loading} size={size}>
      {!value || loading ? (
        <Loading color={theme.palette.accents_2} />
      ) : (
        <ReactQRCode
          ref={ref}
          value={value ?? ''}
          size={qrSize}
          logoImage={base64Logo}
          logoWidth={60}
          removeQrCodeBehindLogo
          logoOpacity={1}
          eyeRadius={8}
        />
      )}
    </Container>
  );
});

export default QRCode;
