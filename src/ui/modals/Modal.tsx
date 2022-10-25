import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { useBodyScroll } from '@geist-ui/core';
import Colors from '../Colors';
import { FadeIn } from '../elements/Motion';
import AppState from '../recoil/app.recoil';
import FundFaucetModal, { FundFaucetModalProps } from './FundFaucet.modal';
// import RedeemFaucetModal, { RedeemFaucetModalProps } from './RedeemFaucet.modal';
import WithdrawFaucetModal, {
  WithdrawFaucetModalProps,
} from './WithdrawFaucet.modal';
import ConfigureFaucetModal, {
  ConfigureFaucetModalProps,
} from './ConfigureFaucet.modal';

export enum ModalTypes {
  FundFaucet = 'FundFaucet',
  RedeemFaucet = 'RedeemFaucet',
  WithdrawFaucet = 'WithdrawFaucet',
  ConfigureFaucet = 'ConfigureFaucet',
}

interface ModalProps {
  [ModalTypes.FundFaucet]: FundFaucetModalProps;
  // [ModalTypes.RedeemFaucet]: RedeemFaucetModalProps;
  [ModalTypes.WithdrawFaucet]: WithdrawFaucetModalProps;
  [ModalTypes.ConfigureFaucet]: ConfigureFaucetModalProps;
}

export type TModalProps = ModalProps[keyof ModalProps];

export interface ModalConfig {
  type: ModalTypes;
  props: TModalProps;
}

/** ******************************************************************************
 *  Modal
 ****************************************************************************** */

const Container = styled(FadeIn)`
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: ${Colors.Black75};
  z-index: 100;
  overflow-y: scroll;
`;

export const ModalProvider: React.FC = () => {
  /* State */
  const modals = useRecoilValue(AppState.modals);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isLocked, lockScroll] = useBodyScroll();
  const open = modals.length > 0;

  React.useEffect(() => {
    lockScroll(open);

    return () => {
      lockScroll(false);
    };
  }, [open, lockScroll]);

  /** Render */
  if (!open) return null;

  return (
    <Container duration={0.1}>
      {modals.map((modal: ModalConfig, index: number) => (
        <RenderModal
          key={index}
          modal={modal}
          active={index === modals.length - 1}
        />
      ))}
    </Container>
  );
};

/** ******************************************************************************
 *  Render Modal
 ****************************************************************************** */

type RenderModalContainerProps = {
  active: boolean;
};

const RenderModalContainer = styled.div<RenderModalContainerProps>`
  position: ${(props) => (props.active ? null : 'absolute')};
  top: ${(props) => (props.active ? null : '-10000000px')};
  left: ${(props) => (props.active ? null : '-10000000px')};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  height: 100%;
  width: 100%;
`;

type RenderModalProps = {
  modal: ModalConfig;
  active: boolean;
};

const RenderModal: React.FC<RenderModalProps> = ({ modal, active }) => (
  <RenderModalContainer active={active}>
    {(() => {
      const props = modal.props as any;

      switch (modal.type) {
        case ModalTypes.FundFaucet:
          return <FundFaucetModal {...props} />;
        // case ModalTypes.RedeemFaucet:
        //   return <RedeemFaucetModal {...props} />;
        case ModalTypes.WithdrawFaucet:
          return <WithdrawFaucetModal {...props} />;
        case ModalTypes.ConfigureFaucet:
          return <ConfigureFaucetModal {...props} />;
        default:
          return <div />;
      }
    })()}
  </RenderModalContainer>
);
