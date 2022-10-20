import React from 'react';
import styled from '@emotion/styled';

type FlexProps = {
  children?: any;
  height?: string;
  width?: string;
  direction?: string;
  justify?: string;
  align?: string;
  padding?: string;
  margin?: string;
  flex?: string;
  background?: string;
  overflow?: string;
  position?: string;
  id?: string;
  onClick?: () => void;
  tip?: string;
  tipPlace?: string;
  wrap?: boolean;
};

const Container = styled.div<FlexProps>`
  display: flex;
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  flex-direction: ${(props) => props.direction};
  position: ${(props) => props.position};
  justify-content: ${(props) => props.justify};
  align-items: ${(props) => props.align};
  padding: ${(props) => props.padding};
  margin: ${(props) => props.margin};
  flex: ${(props) => props.flex};
  overflow: ${(props) => props.overflow};
  flex-wrap: ${(props) => (props.wrap ? 'wrap' : null)};
  background: ${(props) => props.background ?? null};

  &:hover {
    cursor: ${(props) => (props.onClick ? 'pointer' : null)};
  }
`;

export const Spacer = styled.div`
  width: 16px;
`;

export const CustomSpacer = styled.div<{ height?: string; width?: string }>`
  height: ${(props) => props.height};
  width: ${(props) => props.width};
`;

const Flex = React.forwardRef<any, FlexProps>(
  (
    {
      children,
      height = '',
      width = null,
      direction = 'row',
      justify = '',
      align = '',
      padding = '',
      margin = '',
      flex = '',
      overflow = '',
      position = 'relative',
      id = '',
      onClick = null,
      background,
      tip,
      tipPlace,
      wrap,
    },
    ref,
  ) => (
    <Container
      ref={ref}
      id={id}
      height={height}
      width={width as any}
      direction={direction}
      justify={justify}
      align={align}
      padding={padding}
      margin={margin}
      flex={flex}
      position={position}
      overflow={overflow}
      onClick={onClick ? () => onClick() : (null as any)}
      background={background}
      data-tip={tip}
      data-place={tipPlace}
      wrap={wrap}
    >
      {children}
    </Container>
  ),
);

export default Flex;
