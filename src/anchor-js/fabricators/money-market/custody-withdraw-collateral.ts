import { Dec, Int, MsgExecuteContract } from '@terra-money/terra.js';
import { validateAddress } from '../../utils/validation/address';
import { validateInput } from '../../utils/validate-input';

import { validateWhitelistedMarket } from '../../utils/validation/market';
import { validateTrue } from '../../utils/validation/true';
import { validateIsGreaterThanZero } from '../../utils/validation/number';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  address: string;
  market: string;
  borrower?: string;
  redeem_all: boolean;
  amount?: string | undefined;
}

/**
 *
 * @param address Client’s Terra address.
 * @param market Type of stablecoin money market to redeem collateral.
 * @param symbol Symbol of collateral to redeem.
 * @param redeem_all Set this to true to redeem all symbol collateral deposited to loan_id.
 * @param amount (optional) Amount of collateral to redeem. Set this to null if redeem_all is true.
 * @param withdraw_to (optional) Terra address to withdraw redeemed collateral. If null, withdraws to address.
 */
export const fabricateCustodyWithdrawCollateral = ({
  address,
  market,
  redeem_all = true,
  amount = null,
}: Option) => (
  addressProvider: AddressProvider.Provider,
): MsgExecuteContract[] => {
  validateInput([
    validateAddress(address),
    validateWhitelistedMarket(market),
    amount ? validateIsGreaterThanZero(amount) : validateTrue,
  ]);

  const custodyContract = addressProvider.custody(market.toLocaleLowerCase());

  return [
    // withdraw from custody
    new MsgExecuteContract(address, custodyContract, {
      // @see https://github.com/Anchor-Protocol/money-market-contracts/blob/master/contracts/custody/src/msg.rs#L69
      withdraw_collateral: {
        amount: redeem_all ? undefined : amount,
      },
    }),
  ];
};
