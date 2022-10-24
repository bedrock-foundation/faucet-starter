const truncate = (value: string): string => {
  return `${value.substring(0, 4)}...${value.substring(value.length - 4)}`;
};

const AccountUtil = {
  truncate,
};

export default AccountUtil;
