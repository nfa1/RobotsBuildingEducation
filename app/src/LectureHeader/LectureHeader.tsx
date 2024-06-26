import isEmpty from "lodash/isEmpty";
import { RiseUpAnimation } from "../styles/lazyStyles";

// Define styles
const headerStyle = {
  color: "white",
  marginTop: 6,
  fontFamily: "Bungee",
};

/**
 *
 * @returns a component that renders the title of the selected module
 */
export const LectureHeader = ({ uiStateReference, topRef }) => {
  // Check for the existence of the header in patreonObject
  const headerExists = !isEmpty(uiStateReference.patreonObject.header);

  // Early return if header doesn't exist
  if (!headerExists) return null;

  // Render the header if it exists
  return (
    <>
      {/* <div ref={topRef}></div> */}
      <br />
      <RiseUpAnimation>
        <h2 style={headerStyle}>
          {uiStateReference.patreonObject?.header || ""}
        </h2>
      </RiseUpAnimation>
      <br />
    </>
  );
};
