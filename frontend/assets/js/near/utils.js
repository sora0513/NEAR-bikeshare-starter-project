import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
import getConfig from "./config";

const nearConfig = getConfig(process.env.NODE_ENV || "development");

/** コントラクトを初期化し, グローバル変数(window)をセットします. */
export async function initContract() {
  // NEAR testnet へ接続.
  const near = await connect(
    Object.assign(
      { deps: { keyStore: new keyStores.BrowserLocalStorageKeyStore() } },
      nearConfig
    )
  );

  // ウォレット接続を初期化
  window.walletConnection = new WalletConnection(near);

  // アカウントidの取得, この時点で承認されていない場合は空文字列が入ります.
  window.accountId = window.walletConnection.getAccountId();

  // コントラクトAPIの初期化
  window.contract = await new Contract(
    window.walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ["get_greeting"],
      changeMethods: ["set_greeting"],
    }
  );
}

export function logout() {
  window.walletConnection.signOut();
  // ページをリロード
  window.location.replace(window.location.origin + window.location.pathname);
}

export function login() {
  // 新たなアクセスキー(function call key)を作成し, 秘密鍵をlocalStorageに保存します.
  window.walletConnection.requestSignIn(nearConfig.contractName);
}

export async function set_greeting(message) {
  let response = await window.contract.set_greeting({
    args: { message: message },
  });
  return response;
}

export async function get_greeting() {
  let greeting = await window.contract.get_greeting();
  return greeting;
}
