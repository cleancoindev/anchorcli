import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';
import { stringifyNumber } from 'yaml/util';

interface Option {
  lcd: LCDClient;
  overseer: string;
  borrower: string;
  blockTime?: number;
}
interface BorrowLimitResponse {
  borrower: string;
  borrowLimit: string;
}

export const queryOverseerBorrowLimit = ({
  lcd,
  overseer,
  borrower,
  blockTime,
}: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<BorrowLimitResponse> => {
  const overseerContractAddress = addressProvider.overseer(overseer);
  let response: BorrowLimitResponse = await lcd.wasm.contractQuery(
    overseerContractAddress,
    {
      borrow_limit: {
        borrower: borrower,
        block_time: +blockTime,
      },
    },
  );
  return response;
};
