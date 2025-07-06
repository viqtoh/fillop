import React, { memo } from "react";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const DocRenderer = memo(({ url }) => {
  return (
    <div style={{ height: "90vh" }}>
      {" "}
      {/* Ensure parent container has height */}
      <DocViewer
        pluginRenderers={DocViewerRenderers}
        documents={[{ uri: url }]}
        style={{ height: "90vh" }} // Make viewer fill its parent
        config={{
          header: {
            disableHeader: true,
            disableFileName: true
          }
        }}
      />
    </div>
  );
});

export default DocRenderer;
