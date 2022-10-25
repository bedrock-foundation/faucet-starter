import React from 'react';
import {
  Badge,
  Button,
  Card,
  Image,
  Loading,
  Spacer,
  Table,
  Text,
  useClipboard,
  useTheme,
  useToasts,
} from '@geist-ui/core';
import styled from '@emotion/styled';
import ReactTooltip from 'react-tooltip';
import type {
  Scan,
  ScanStates,
  ScanTypes,
} from '~/server/services/scan/scan.service';
import TimeUtil from '~/shared/utils/TimeUtil';
import { Droplet, Icon, MinusCircle, PlusCircle } from '@geist-ui/icons';
import TokenUtil, { TokenBalance } from '~/shared/utils/TokenUtil';
import Flex from '../elements/Flex';
import { trpc } from '~/shared/trpc';
import AccountUtil from '~/shared/utils/AccountUtil';

const Container = styled.div`
  position: relative;
  height: 100%;
  box-sizing: border-box;
`;

type CellTextProps = {
  color: string;
};

const CellText = styled<CellTextProps & any>(Text)`
  &&& {
    font-size: 14px;
    white-space: nowrap;
    color: ${(props) => props.color};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 250px;

    &:hover {
      cursor: ${(props) => (props.onClick ? 'pointer' : null)};
    }
  }
`;

const convert = (balance: TokenBalance) => {
  return (
    TokenUtil.formatQuantity(
      balance.amount ?? '0',
      balance?.mint,
      balance?.info ?? undefined,
    ) ?? '0'
  );
};

type ScansTabelProps = {
  faucetId: string;
};

const ScansTableInner: React.FC<ScansTabelProps> = ({ faucetId }) => {
  /* Hooks */
  const theme = useTheme();
  const { setToast } = useToasts();
  const { copy } = useClipboard();

  /* State */
  const scanList = trpc.scan.list.useQuery({ faucetId });
  const refresh = () => scanList.refetch();

  /**
   * Rebuild ToolTip
   */
  React.useEffect(() => {
    ReactTooltip.hide();
    ReactTooltip.rebuild();
  });

  type ScanTableRow = {
    scannerId: Scan;
    type: Scan;
    tokenAmount: Scan;
    message: Scan;
    state: Scan;
    createdAt: Scan;
    userAgent: Scan;
    location: Scan;
  };

  /**
   * Render
   */
  const tableData: ScanTableRow[] =
    scanList?.data?.map((scan: Scan) => {
      return {
        scannerId: scan,
        type: scan,
        tokenAmount: scan,
        message: scan,
        state: scan,
        createdAt: scan,
        userAgent: scan,
        location: scan,
      };
    }) ?? [];

  const renderText = (
    value: string | number | ScanTableRow['tokenAmount'],
    tip?: string,
    onClick?: () => void,
  ) => {
    return (
      <CellText
        font="14px"
        color={theme.palette.accents_7}
        onClick={onClick}
        data-tip={tip}
      >
        {value}
      </CellText>
    );
  };

  if (!scanList?.data?.length) {
    return (
      <Card width="1000px" height="300px">
        <Flex
          align="center"
          justify="center"
          flex="1"
          direction="column"
          height="100%"
        >
          <Flex
            align="center"
            justify="center"
            flex="1"
            direction="column"
            width="470px"
          >
            <Spacer h={0.5} />
            <Text style={{ textAlign: 'center' }} font="16px">
              No interactions yet. Deposit some tokens to get started.
            </Text>
            <Spacer h={0.5} />
            <Flex width="80%">
              <Button width="100%" scale={1.25}>
                Deposit Tokens
              </Button>
            </Flex>
          </Flex>
        </Flex>
      </Card>
    );
  }

  return (
    <Container theme={theme}>
      <Card>
        <Flex width="100%" justify="space-between" align="center">
          <Text h4 margin="0">
            Interactions
          </Text>
          <Flex>
            <Button scale={3 / 4} auto onClick={() => refresh()}>
              Refresh
            </Button>
            <Spacer />
          </Flex>
        </Flex>
        <Spacer />
        <Card>
          <Table<ScanTableRow> data={tableData} hover={false}>
            <Table.Column<ScanTableRow>
              prop="scannerId"
              label="Address"
              render={(scan) => {
                return renderText(
                  AccountUtil.truncate(scan.scannerId as string),
                  'Copy Address',
                  () => {
                    copy(scan.scannerId as string);
                    setToast({ text: 'Address Copied!', delay: 3000 });
                  },
                );
              }}
            />
            <Table.Column<ScanTableRow>
              prop="state"
              label="Status"
              render={(scan) => (
                <Flex align="center" flex="0">
                  <Badge
                    dot
                    type={(() => {
                      switch (scan.state as ScanStates) {
                        case 'Scanned':
                          return 'warning';
                        case 'Failed':
                          return 'error';
                        case 'Confirmed':
                          return 'success';

                        default:
                          return 'default';
                      }
                    })()}
                  />
                  <Spacer w={0.5} h={0} />
                  {renderText(
                    (() => {
                      switch (scan.state as ScanStates) {
                        case 'Scanned':
                          return 'In Progress';

                        case 'Failed':
                          return 'Failed';

                        case 'Confirmed':
                          return 'Success';

                        default:
                          return 'Unknown';
                      }
                    })(),
                  )}
                </Flex>
              )}
            />
            <Table.Column<ScanTableRow>
              prop="type"
              label="Type"
              render={(scan) => (
                <Flex align="center" flex="0">
                  {(() => {
                    const render = (Component: Icon) => (
                      <Component size={18} color={theme.palette.accents_6} />
                    );
                    switch (scan.type as ScanTypes) {
                      case 'Add Funding':
                        return render(PlusCircle);
                      case 'Redemption':
                        return render(Droplet);
                      case 'Withdrawl':
                        return render(MinusCircle);

                      default:
                        return render(Droplet);
                    }
                  })()}
                  <Spacer w={0.5} h={0} />
                  {renderText(scan.type)}
                </Flex>
              )}
            />
            <Table.Column<ScanTableRow>
              prop="createdAt"
              label="Date"
              render={(scan) =>
                renderText(
                  TimeUtil.format(
                    new Date(scan.createdAt).getTime() ?? 0,
                    'ff',
                    Intl.DateTimeFormat().resolvedOptions().timeZone,
                  ),
                )
              }
            />
            <Table.Column<ScanTableRow>
              prop="tokenAmount"
              label="Change"
              render={({ balanceChanges, type, state }: Partial<any>) => {
                return (
                  <Flex align="center" flex="0">
                    {balanceChanges
                      ?.filter(
                        ({ amount }: { amount: any }) =>
                          BigInt(amount) > BigInt(0),
                      )
                      ?.sort((a: any, b: any) => (a.mint > b.mint ? 1 : -1))
                      ?.map((balance: any) => {
                        const { amount, info } = balance;
                        const render = (color: string, text: string) => (
                          <Flex align="center" key={balance.mint}>
                            <Image
                              src={info?.logoURI ?? ''}
                              alt="Token Logo"
                              height="16px"
                              width="16px"
                              style={{ borderRadius: '50%' }}
                            />
                            <Spacer w={0.5} h={0} />
                            <CellText font="10px" color={color}>
                              {text}
                            </CellText>
                            <Spacer w={1} h={0} />
                          </Flex>
                        );

                        if (state === 'Failed' || !amount) {
                          return render(theme.palette.accents_8, '--');
                        }

                        const formattedAmount = convert(balance);

                        switch (type as ScanTypes) {
                          case 'Add Funding':
                            return render(
                              theme.palette.cyanDark,
                              `+${formattedAmount}`,
                            );
                          case 'Redemption':
                            return render(
                              theme.palette.error,
                              `-${formattedAmount}`,
                            );
                          case 'Withdrawl':
                            return render(
                              theme.palette.error,
                              `-${formattedAmount}`,
                            );

                          default:
                            return render(
                              theme.palette.accents_8,
                              `${formattedAmount}`,
                            );
                        }
                      })}
                  </Flex>
                );
              }}
            />
            <Table.Column<ScanTableRow>
              prop="message"
              label="Message"
              render={(scan: any) => {
                return (
                  <Flex justify="space-between" align="center" width="100%">
                    {renderText(scan.message)}
                    {scan?.signature && (
                      <Button
                        scale={1 / 2}
                        width="60px"
                        onClick={() =>
                          window.open(`https://solscan.io/tx/${scan.signature}`)
                        }
                      >
                        View
                      </Button>
                    )}
                  </Flex>
                );
              }}
            />
          </Table>
        </Card>
      </Card>
    </Container>
  );
};

const ScansTable = (props: ScansTabelProps) => {
  const theme = useTheme();

  return (
    <React.Suspense
      fallback={
        <Container theme={theme}>
          <Card width="100%">
            <Flex align="center" justify="center" height="400px">
              <Loading />
            </Flex>
          </Card>
        </Container>
      }
    >
      <ScansTableInner {...props} />
    </React.Suspense>
  );
};

export default ScansTable;
