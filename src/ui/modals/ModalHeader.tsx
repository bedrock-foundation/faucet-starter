import React from 'react';
import styled from '@emotion/styled';
import { Card, Text } from '@geist-ui/core';
import { X } from '@geist-ui/icons';
import useModal from '../hooks/useModal.hook';
import Flex from '../elements/Flex';

const Close = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

export type ModalHeaderProps = {
  title: string;
  onClose?: () => void;
};

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, onClose }) => {
  /** Actions */
  const { pop } = useModal();

  /* Render */
  return (
    <Card.Content>
      <Flex align="center" justify="space-between">
        <Text b my={0} font="18px">
          {title}
        </Text>
        <Close
          onClick={() => {
            onClose?.();
            pop();
          }}
        >
          <X />
        </Close>
      </Flex>
    </Card.Content>
  );
};

export default ModalHeader;
