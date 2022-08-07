import React, { useEffect, useState } from "react";

import "./assets/css/global.css";

import { login, logout } from "./assets/js/near/utils";

export default function App() {
  /** バイクの情報をフロント側で保持するための配列です */
  const [allBikeInfo, setAllBikeInfo] = useState([]);
  /**
   * bikeInfoオブジェクトを定義します.
   * allBikeInfoはbikeInfoオブジェクトの配列となります.
   * 各属性はログインアカウントと連携した情報になります.
   * available:  ログインアカウントはバイクを使用可能か否か
   * in_use:     同じく使用中か否か
   * inspection: 同じく点検中か否か
   */
  const initialBikeInfo = async () => {
    return { available: false, in_use: false, inspection: false };
  };

  /** どの画面を描画するのかの状態を定義しています */
  const RenderingStates = {
    SIGN_IN: "sign_in",
    REGISTRATION: "registration",
    HOME: "home",
    TRANSACTION: "transaction",
  };
  /** useStateを利用して描画する状態を保持します */
  const [renderingState, setRenderingState] = useState(RenderingStates.HOME);

  /** 残高表示する際に利用します */
  const [showBalance, setShowBalance] = useState(false);
  const [balanceInfo, setBalanceInfo] = useState({});
  const initialBalanceInfo = async () => {
    return { account_id: "", balance: 0 };
  };

  /** コントラクト側で定義されている, バイクを使うのに必要なftを保持します */
  const [amountToUseBike, setAmountToUseBike] = useState(0);

  const bikeImg = require("./assets/img/bike.png");

  // 初回レンダリング時の処理.
  // サイン後にもブラウザのページがリロードされるので, この内容が実行されます.
  useEffect(() => {
    const initRenderingState = async () => {
      if (!window.walletConnection.isSignedIn()) {
        setRenderingState(RenderingStates.SIGN_IN);
      }
    };

    initRenderingState();
  }, []);

  const signOutButton = () => {
    return (
      <button className="link" style={{ float: "right" }} onClick={logout}>
        Sign out
      </button>
    );
  };

  const unregisterButton = () => {
    return (
      <button className="link" style={{ float: "right" }}>
        Unregister
      </button>
    );
  };

  const requireSignIn = () => {
    return (
      <div>
        <main>
          <p style={{ textAlign: "center", marginTop: "2.5em" }}>
            <button onClick={login}>Sign in</button>
          </p>
        </main>
      </div>
    );
  };

  const requireRegistration = () => {
    return (
      <div>
        {signOutButton()}
        <div style={{ textAlign: "center" }}>
          <h5>
            Registration in ft contract is required before using the bike app
          </h5>
        </div>
        <main>
          <p style={{ textAlign: "center", marginTop: "2.5em" }}>
            <button>storage deposit</button>
          </p>
        </main>
      </div>
    );
  };

  const header = () => {
    return <h1>Hello {window.accountId} !</h1>;
  };

  const transaction = () => {
    return (
      <div>
        {header()}
        <main>
          <p> in process... </p>
        </main>
      </div>
    );
  };

  const bikeContents = () => {
    return (
      <div>
        {allBikeInfo.map((bike, index) => {
          return (
            <div class="bike" style={{ display: "flex" }}>
              <div class="bike_img">
                <img src={bikeImg} />
              </div>
              <div class="bike_index">: {index}</div>
              <button>use</button>
              <button>inspect</button>
              <button>return</button>
            </div>
          );
        })}
      </div>
    );
  };

  const checkBalance = () => {
    return (
      <div class="balance_content">
        <button>check my balance</button>
        <button style={{ marginTop: "0.1em" }}>check contract's balance</button>
        <span>or</span>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const { fieldset, account } = event.target.elements;
            const account_to_check = account.value;
            fieldset.disabled = true;
            try {
            } catch (e) {
              alert(e);
            }
            fieldset.disabled = false;
          }}
        >
          <fieldset id="fieldset">
            <div style={{ display: "flex" }}>
              <input autoComplete="off" id="account" placeholder="account id" />
              <button style={{ borderRadius: "0 5px 5px 0" }}>check</button>
            </div>
          </fieldset>
        </form>
        {showBalance && (
          <div>
            <p>{balanceInfo.account_id}'s</p>
            <p>balance: {balanceInfo.balance}</p>
          </div>
        )}
      </div>
    );
  };

  const transferFt = () => {
    return (
      <div>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            const { fieldset, account } = event.target.elements;
            const account_to_transfer = account.value;
            fieldset.disabled = true;
            try {
            } catch (e) {
              alert(e);
            }
            fieldset.disabled = false;
          }}
        >
          <fieldset id="fieldset">
            <label
              htmlFor="account"
              style={{
                display: "block",
                color: "var(--gray)",
                marginBottom: "0.5em",
                marginTop: "1em",
              }}
            >
              give someone {amountToUseBike.toString()} ft
            </label>
            <div style={{ display: "flex" }}>
              <input
                autoComplete="off"
                id="account"
                style={{ flex: 1 }}
                placeholder="account id"
              />
              <button style={{ borderRadius: "0 5px 5px 0" }}>transfer</button>
            </div>
          </fieldset>
        </form>
      </div>
    );
  };

  const home = () => {
    return (
      <div>
        {signOutButton()}
        {unregisterButton()}
        {header()}
        <main>
          {bikeContents()}
          {checkBalance()}
          {transferFt()}
        </main>
      </div>
    );
  };

  switch (renderingState) {
    case RenderingStates.SIGN_IN:
      return <div>{requireSignIn()}</div>;

    case RenderingStates.REGISTRATION:
      return <div>{requireRegistration()}</div>;

    case RenderingStates.TRANSACTION:
      return <div>{transaction()}</div>;

    case RenderingStates.HOME:
      return <div>{home()}</div>;
  }
}
