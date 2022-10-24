import React from 'react';
import { Spacer, Text } from '@geist-ui/core';
import ReactTooltip from 'react-tooltip';
import { QuestionCircle } from '@geist-ui/icons';
import Flex from './Flex';

type LabelProps = {
  children: string;
  subText?: string;
  tip?: string;
};

const Label: React.FC<LabelProps> = ({ children, subText, tip }) => {
  /**
   * Rebuild ToolTip
   */
  React.useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  return (
    <>
      <Flex align="center">
        <Text
          font="12px"
          type="default"
          marginTop="0"
          marginBottom="0"
          marginRight="4px"
          span
          b
        >
          {children}
          {subText && (
            <Text b span marginLeft="2px" type="secondary">
              {subText}
            </Text>
          )}
        </Text>
        {tip && <QuestionCircle size="16px" data-tip={tip} />}
      </Flex>
      <Spacer h={0.5} />
    </>
  );
};

export default Label;
