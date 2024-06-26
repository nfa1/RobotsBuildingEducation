// This component is discontinued but contains software around a chat interface.
// This software may be repurposed for future features.

import { useEffect, useState } from "react";
import { japaneseThemePalette, textBlock } from "../../../../styles/lazyStyles";
import { Button, Modal } from "react-bootstrap";
import { ConversationGrader } from "./ConversationGrader/ConversationGrader";
import {
  customInstructions,
  gatherConversationContext,
} from "./ChatBlock.compute";
import { postInstructions } from "../../../uiSchema";
import { useZapAnimation } from "../../../../App.hooks";

export const EmotionalIntelligenceStyles = {
  Header: {
    backgroundColor: "black",
    color: "white",
  },
  Body: {
    backgroundColor: "black",
    color: "white",
  },

  Banner: {
    textAlign: "center",
    display: "flex",
    justifyContent: "center",
  },

  BannerBackground: {
    // backgroundColor: "rgba(220, 208, 255, 1)",
    borderBottom: "1px solid skyblue",
    textShadow: "0px 0px 25px black",
    padding: 24,
    borderRadius: 24,
    marginTop: 48,
  },

  EnergyLevelContainer: {
    paddingTop: 24,
    PaddingBottom: 24,
    paddingRight: 24,
  },

  RowWrapCenter: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  RowJustifyCenter: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  JourneyContainer: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: 12,
  },

  Footer: {
    backgroundColor: "black",
    color: "white",
  },

  EmotionHeader: {
    backgroundColor: "black",
    color: "white",
    borderBottom: "0px solid transparent",
    borderRight: "5px solid lavender",
    borderLeft: "5px solid lavender",
    borderTop: "5px solid lavender",
  },

  EmotionBody: {
    backgroundColor: "black",
    color: "white",
    borderRight: "5px solid lavender",
    borderLeft: "5px solid lavender",
    height: 500,
  },

  EmotionFooter: {
    backgroundColor: "black",
    color: "white",
    borderTop: "1px solid transparent",
    borderRight: "5px solid lavender",
    borderLeft: "5px solid lavender",
    borderBottom: "5px solid lavender",
  },

  EmotionNote: { width: 300, height: 125, margin: 5 },

  GenerateInsightButton: {
    width: "100%",
    marginTop: 6,
    paddingTop: 12,
    paddingBottom: 12,
  },

  TextAlignCenter: { textAlign: "center" },

  AiResponseContainer: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    textShadow: "1px 1px 5px black",
    height: 425,
    overflow: "scroll",
  },
  SummarizerResponseContainer: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
    textShadow: "1px 1px 5px black",
    minHeight: 350,
    overflow: "scroll",
  },

  AiResponseMessage: {
    backgroundColor: "#2C2C2E",
    height: "fit-content",
    padding: 15,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
};
export let ChatBlock = ({ children, type = "quiz" }) => {
  const zapAnimation = useZapAnimation();
  const [isConversationContextWindowOpen, setIsConversationContextWindowOpen] =
    useState(false);
  const [conversationInput, setConversationInput] = useState("");
  const [conversation, setConversation] = useState([]);
  const [isAiResponseLoading, setIsAiResponseLoading] = useState(false);
  const [chatGptResponse, setChatGptResponse] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradeResult, setGradeResult] = useState("");
  const [isGrading, setIsGrading] = useState(false);

  let [boxShadow, setBoxShadow] = useState("6px 6px 5px 0px rgba(0,0,0,0.75)");

  let messageContext = gatherConversationContext(children);

  let instructions = customInstructions({ type, messageContext });

  let handleConversation = async (grade = false) => {
    let convoData = "";
    let prompt = "";

    zapAnimation();
    if (!grade) {
      setConversation([
        ...conversation,
        { request: conversationInput, response: "" },
      ]);

      setIsAiResponseLoading(true);
      let convoData =
        conversation?.length > 0
          ? `This is the stringified JSON of conversation so far: ${JSON.stringify(
              conversation
            )}. Answer this input only: ${conversationInput}`
          : `Answer this input only: ${conversationInput}`;
      prompt = instructions + convoData;
    }

    setConversationInput("");
    if (grade) {
      setIsGrading(true);
      setConversation([
        ...conversation,
        { request: "pls grade our conversation 🙏", response: "" },
      ]);

      setIsAiResponseLoading(true);
      prompt = `This is the quiz ${messageContext.join(
        ""
      )}. This quiz is for context only. This is the stringified JSON of the conversation ${JSON.stringify(
        conversation
      )}. Please grade the conversation only with a score 0-10. Do not weigh the original quiz content under any circumstance. Be a tough grader. Strongly weigh the quality of the requests AND responses. The requests should be thoughtful and complete inquries. All questions in the quiz should be specifically talked about in the conversation. The amount of conversation indexes should match or exceed the amount of questions or topics asked in the quiz. If not, students should get points heavily deducted for that section. Report back what was done well and what could have been done better, outlining each question. Each question or topic is worth 10 points, for a total of the total amount of questions or topics. If questions or topics go unanswered, give a score of 0 and add it to the overall result.`;
    }

    const response = await fetch(postInstructions.url, {
      method: postInstructions.method,
      headers: postInstructions.headers,
      body: JSON.stringify({ prompt }),
    }).catch(() => {
      setIsAiResponseLoading(false);
    });

    if (response && !grade) {
      let data = await response.json();
      setIsAiResponseLoading(false);
      setChatGptResponse(data?.bot?.content || "");
    } else if (response && grade) {
      let data = await response.json();

      setIsAiResponseLoading(false);
      setGradeResult(data?.bot?.content);
    }
  };

  useEffect(() => {
    if (chatGptResponse) {
      let lastConvoIndex = conversation[conversation.length - 1];

      let conversationCopy = conversation;
      conversationCopy.pop();

      setConversation([
        ...conversationCopy,
        { request: lastConvoIndex?.request, response: chatGptResponse },
      ]);
    }
  }, [chatGptResponse]);

  useEffect(() => {
    if (isGrading) {
      let lastConvoIndex = conversation[conversation.length - 1];

      let conversationCopy = conversation;
      conversationCopy.pop();

      setConversation([
        ...conversationCopy,
        {
          request: lastConvoIndex?.request,
          response: gradeResult,
          grade: true,
        },
      ]);

      setIsGrading(false);
    }
  }, [gradeResult]);

  // return <div>{children}</div>;
  return (
    <div
      style={{
        ...textBlock(
          japaneseThemePalette.PowerPurple,
          0,
          12,
          "white",
          "4px 4px 5px 0px rgba(0,0,0,0.75)"
        ),
      }}
    >
      <button
        onMouseEnter={() => {
          setBoxShadow(`6px 6px 5px 0px ${japaneseThemePalette.PowerPurple}`);
        }}
        onMouseLeave={() => {
          setBoxShadow("6px 6px 5px 0px rgba(0,0,0,0.75)");
        }}
        style={{
          boxShadow: boxShadow,
          backgroundColor: "#FFD68B",
        }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        ⭐
      </button>
      <Modal
        centered
        fullscreen={false}
        show={isModalOpen}
        // show={true}
        onHide={() => setIsModalOpen(false)}
        keyboard={true}
        style={{ zIndex: 1000000 }}
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={{
            backgroundColor: "black",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "5px solid lavender",
            borderLeft: "5px solid lavender",
            borderRight: "5px solid lavender",
            borderBottom: "1px solid black",
          }}
        >
          <Modal.Title style={{ fontFamily: "Bungee" }}>
            Conversation Grader
          </Modal.Title>
          &nbsp;&nbsp; &nbsp;
          <Button
            variant="primary"
            onClick={() => handleConversation(true)}
            disabled={isGrading || isAiResponseLoading}
          >
            Grade
          </Button>
        </Modal.Header>
        <Modal.Body
          //   onHide={() => setIsModalOpen(false)}
          style={{
            padding: 0,
            backgroundColor: "black",
            color: "white",
            padding: 24,
            borderLeft: "5px solid lavender",
            borderRight: "5px solid lavender",
          }}
        >
          <div
            style={{
              border: "3px solid pink",
              cursor: "pointer",

              ...textBlock(japaneseThemePalette.FujiSanBlue, 0, 12),
              boxShadow: " -4px -5px 0px 0px rgba(9,0,255,1)",
              padding: 6,
            }}
            onClick={() => setIsConversationContextWindowOpen(true)}
          >
            View quiz
          </div>
          <ConversationGrader
            type={type}
            instructions={instructions}
            conversationInput={conversationInput}
            setConversationInput={setConversationInput}
            conversation={conversation}
            gradeResult={gradeResult}
          />
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: "black",
            borderBottom: "5px solid lavender",
            borderLeft: "5px solid lavender",
            borderRight: "5px solid lavender",
            borderTop: "1px solid black",
          }}
        >
          {/* <Button
            variant="dark"
            onClick={() => {
              setIsModalOpen(false);
            }}
            disabled={isGrading || isAiResponseLoading}
          >
            Exit
          </Button> */}

          <Button
            variant="dark"
            onClick={() => handleConversation(false)}
            disabled={isGrading || isAiResponseLoading}
          >
            Add to conversation
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isConversationContextWindowOpen}
        centered
        keyboard
        onHide={() => setIsConversationContextWindowOpen(false)}
        style={{ zIndex: 100000000 }}
      >
        <Modal.Header
          closeButton
          closeVariant="white"
          style={EmotionalIntelligenceStyles.EmotionHeader}
        >
          <Modal.Title style={{ fontFamily: "Bungee" }}>
            ConversationGrader4444
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            ...EmotionalIntelligenceStyles.EmotionBody,
            overflow: "scroll",
          }}
        >
          {children}
        </Modal.Body>
        <Modal.Footer style={EmotionalIntelligenceStyles.EmotionFooter}>
          <Button
            variant="dark"
            onClick={() => setIsConversationContextWindowOpen(false)}
          >
            Exit
          </Button>
        </Modal.Footer>
      </Modal>
      <br /> <br />
      {children}
    </div>
  );
};
