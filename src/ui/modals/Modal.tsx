import React from 'react';
import styled from '@emotion/styled';
import { useRecoilValue } from 'recoil';
import { useBodyScroll } from '@geist-ui/core';
import Colors from '../Colors';
import { FadeIn } from '../elements/Motion';
import FundFaucetModal, { FundFaucetModalProps } from './FundFaucet.modal';
import AppState from '../recoil/app.recoil';
// import RedeemFaucetModal, { RedeemFaucetModalProps } from './RedeemFaucet.modal';
// import WithdrawFaucetModal, { WithdrawFaucetModalProps } from './WithdrawFaucet.modal';

export enum ModalTypes {
  FundFaucet = 'FundFaucet',
  RedeemFaucet = 'RedeemFaucet',
  WithdrawFaucet = 'WithdrawFaucet',
}

interface ModalProps {
  [ModalTypes.FundFaucet]: FundFaucetModalProps;
  // [ModalTypes.RedeemFaucet]: RedeemFaucetModalProps;
  // [ModalTypes.WithdrawFaucet]: WithdrawFaucetModalProps;
}

export type TModalProps = ModalProps[keyof ModalProps];

export interface ModalConfig {
  type: ModalTypes;
  props: TModalProps;
}

export enum ModalPositions {
  Top = 'Top',
  Center = 'Center',
}

const positions = {
  [ModalTypes.FundFaucet]: ModalPositions.Center,
  [ModalTypes.RedeemFaucet]: ModalPositions.Center,
  [ModalTypes.WithdrawFaucet]: ModalPositions.Center,
};

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
          isTop={positions[modal.type] === ModalPositions.Top}
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
  isTop: boolean;
};

const RenderModalContainer = styled.div<RenderModalContainerProps>`
  position: ${(props) => (props.active ? null : 'absolute')};
  top: ${(props) => (props.active ? null : '-10000000px')};
  left: ${(props) => (props.active ? null : '-10000000px')};
  display: flex;
  justify-content: center;
  align-items: ${(props) => (props.isTop ? 'flex-start' : 'center')};
  padding: ${(props) => (props.isTop ? '100px 0' : '0')};
  height: 100%;
  width: 100%;
`;

type RenderModalProps = {
  modal: ModalConfig;
  active: boolean;
  isTop: boolean;
};

const RenderModal: React.FC<RenderModalProps> = ({ modal, active, isTop }) => (
  <RenderModalContainer active={active} isTop={isTop}>
    {(() => {
      const props = modal.props as any;

      switch (modal.type) {
        case ModalTypes.FundFaucet:
          return <FundFaucetModal {...props} />;
        // case ModalTypes.RedeemFaucet:
        //   return <RedeemFaucetModal {...props} />;
        // case ModalTypes.WithdrawFaucet:
        //   return <WithdrawFaucetModal {...props} />;
        default:
          return <div />;
      }
    })()}
  </RenderModalContainer>
);
