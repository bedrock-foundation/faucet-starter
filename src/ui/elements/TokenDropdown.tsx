import React from 'react';
import { AutoComplete, Image, Spacer, Text } from '@geist-ui/core';
import Flex from './Flex';
import { TokenInfo } from '~/shared/utils/TokenUtil';
import { AutoCompleteOptions } from '@geist-ui/core/esm/auto-complete';

type TokenDropdownProps = {
  value: string;
  tokens: TokenInfo[];
  onSelect: (value: string) => void;
  scale?: number;
};

const TokenDropdown: React.FC<TokenDropdownProps> = ({
  value,
  tokens,
  onSelect,
  scale,
}) => {
  /** State */
  const [options, setOptions] = React.useState<AutoCompleteOptions>();

  const allOptions = tokens.map((token) => {
    return {
      label: token?.name ?? '',
      value: token,
    };
  });

  const makeOption = (label: string, tokenBalance: TokenInfo) => (
    <AutoComplete.Option value={tokenBalance?.address ?? ''}>
      <Flex height="60px" align="center" justify="space-between" width="100%">
        <Flex align="center">
          <Image
            src={tokenBalance?.logoURI ?? ''}
            alt="Token Logo"
            height="30px"
            style={{ borderRadius: '50%' }}
          />
          <Spacer />
          <Text span>{label}</Text>
        </Flex>
      </Flex>
    </AutoComplete.Option>
  );

  const searchHandler = (currentValue: string) => {
    if (!currentValue) {
      setOptions(
        allOptions.map(({ label, value }) => makeOption(label, value)),
      );
      return;
    }
    const relatedOptions = allOptions.filter((item) =>
      JSON.stringify(item.value).includes(currentValue),
    );
    const customOptions = relatedOptions.map(({ label, value }) =>
      makeOption(label, value),
    );
    setOptions(customOptions);
  };
  return (
    <AutoComplete
      placeholder="Select Token"
      value={value}
      width="100%"
      options={options}
      onSearch={searchHandler}
      onSelect={onSelect}
      clearable
      scale={scale}
    />
  );
};

export default TokenDropdown;
