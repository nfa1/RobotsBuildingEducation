import { logEvent } from "firebase/analytics";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";

import ReactJson from "react-json-view";
import { renderWithTooltip } from "../../common/uiSchema";
import { analytics } from "../../database/firebaseResources";
import { ProofOfWork } from "../../ProofOfWork/ProofOfWork";
import { StyledPromptButton } from "../../styles/lazyStyles";
// import { DiscordButton } from "./DiscordButton/DiscordButton";

export const Prompts = ({
  //roxana
  loadingMessage,
  patreonObject,
  handleSubmit,



  //pow
  displayName,
  databaseUserDocument,
  computePercentage,
  globalImpactCounter,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  let promptKeys = Object.keys(patreonObject.prompts);
    let borderHighlight = "#48484a";
  let promptMap = [
    <StyledPromptButton
          tabindex="0"
          style={{ display: loadingMessage ? "none" : "flex" }}
          borderHighlight={borderHighlight}
          loadingMessage={loadingMessage}
          onClick={(event) => {
            if (loadingMessage) {
            } else {
              handleSubmit(event, patreonObject.prompts['patreon'], 'patreon');
            }
          }}
        >
          <a style={{ color: "white" }}>
            {patreonObject.prompts['patreon'].icon}{" "}
            {/* {patreonObject.prompts['patreon'].action} */}
            discover
          </a>
    </StyledPromptButton>,
    <StyledPromptButton
          tabindex="0"
          style={{ display: loadingMessage ? "none" : "flex" }}
          borderHighlight={borderHighlight}
          loadingMessage={loadingMessage}
          onClick={(event) => {
            if (loadingMessage) {
            } else {
              handleSubmit(event, patreonObject.prompts['guide'], 'guide');
            }
          }}
        >
          <a style={{ color: "white" }}>
            {/* {patreonObject.prompts['guide'].icon}{" "} */}
            📚 study
          </a>
    </StyledPromptButton>,

    <StyledPromptButton
          tabindex="0"
          style={{ display: loadingMessage ? "none" : "flex" }}
          borderHighlight={borderHighlight}
          loadingMessage={loadingMessage}
          onClick={(event) => {
            if (loadingMessage) {
            } else {
              handleSubmit(event, patreonObject.prompts['shop'], 'shop');
            }
          }}
        >
          <a style={{ color: "white" }}>
            {patreonObject.prompts['shop'].icon}{" "}
            {patreonObject.prompts['shop'].action}
          </a>
    </StyledPromptButton>,

  ];
  // let promptMap = promptKeys.map((prompt) => {






  //     if (prompt === "intro") {
  //       return null;
  //     }
  //     return (
  //       <StyledPromptButton
  //         tabindex="0"
  //         style={{ display: loadingMessage ? "none" : "flex" }}
  //         borderHighlight={borderHighlight}
  //         loadingMessage={loadingMessage}
  //         onClick={(event) => {
  //           if (loadingMessage) {
  //           } else {
  //             handleSubmit(event, patreonObject.prompts[prompt], prompt);
  //           }
  //         }}
  //       >
  //         <a style={{ color: "white" }}>
  //           {patreonObject.prompts[prompt].icon}{" "}
  //           {patreonObject.prompts[prompt].action}
  //         </a>
  //       </StyledPromptButton>
  //     );
    
  // });
  //render with tooltips : TBD
  // let promptMap = promptKeys.map((prompt) =>
  //   renderWithTooltip(
  //     <StyledPromptButton
  //       loadingMessage={loadingMessage}
  //       onClick={(event) => {
  //         if (loadingMessage) {
  //         } else {
  //           handleSubmit(event, patreonObject.prompts[prompt], prompt);
  //         }
  //       }}
  //     >
  //       {patreonObject.prompts[prompt].icon}{" "}
  //       {patreonObject.prompts[prompt].action}
  //     </StyledPromptButton>,
  //     <div style={{ border: "1px solid pink" }}>
  //       <h3>Prompt Engineering</h3>
  //       <h5 style={{ border: "1px solid green" }}>
  //         Request&nbsp;{patreonObject.prompts[prompt].icon}
  //         <br />
  //         <div>{patreonObject.prompts[prompt].action}</div>
  //       </h5>
  //     </div>,
  //     "left",
  //     {
  //       display: "flex",
  //       justifyContent: "center",
  //       marginRight: "24px",
  //       border: "1px solid red",
  //     }
  //   )
  // );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        flexDirection: "column",
      }}
    >
      <ProofOfWork
        displayName={displayName}
        databaseUserDocument={databaseUserDocument}
        computePercentage={computePercentage}
        globalImpactCounter={globalImpactCounter}
      />
      <Button
        variant="primary"
        onClick={() => {
          logEvent(analytics, "select_content", {
            content_type: "button",
            item_id: "View Roxana",
          });

          setIsModalOpen(true);
        }}
      >
        {patreonObject?.header === "Indocumentadofy"
          ? "💗 Ver Roxana"
          : "💗 View Roxana"}
      </Button>

      {/* <DiscordButton /> */}
      <br />
      <Modal
        centered
        fullscreen={true}
        show={isModalOpen}
        onHide={() => setIsModalOpen(false)}
      >
        <Modal.Header
          closeButton
          style={{ color: "white", backgroundColor: "black" }}
        >
          <Modal.Title>AI Prompt Engineering</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "black", color: "white" }}>
          <h3>What is this?</h3>
          <p>
            This is for students and teachers who are curious of how the AI is
            prompted and fine-tuned over time.
          </p>

          <ReactJson
            theme={"threezerotwofour"}
            enableClipboard
            src={patreonObject}
            quotesOnKeys={false}
          />
        </Modal.Body>
        <Modal.Footer style={{ color: "white", backgroundColor: "black" }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Thanks!
          </Button>
        </Modal.Footer>
      </Modal>


      {promptMap}



    </div>
  );
};
