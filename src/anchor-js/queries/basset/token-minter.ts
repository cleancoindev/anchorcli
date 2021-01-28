import { LCDClient } from '@terra-money/terra.js';
import { AddressProvider } from '../../address-provider/types';

interface Option {
  lcd: LCDClient;
  bAsset: string;
}

interface MinterResponse {
  minter: string;
  cap?: string;
}

export const queryTokenMinter = ({ lcd, bAsset }: Option) => async (
  addressProvider: AddressProvider.Provider,
): Promise<MinterResponse> => {
  const bAssetContractAddress = addressProvider.bAssetToken(bAsset);
  let reponse: MinterResponse = await lcd.wasm.contractQuery(
    bAssetContractAddress,
    {
      minter: {},
    },
  );
  return reponse;
};
