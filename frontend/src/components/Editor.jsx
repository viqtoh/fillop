import React, { useState, useRef } from "react";
import "draft-js-static-toolbar-plugin/lib/plugin.css";

import Editor, { createEditorStateWithText } from "draft-js-plugins-editor";

import createToolbarPlugin, { Separator } from "draft-js-static-toolbar-plugin";
import {
  ItalicButton,
  BoldButton,
  UnderlineButton,
  CodeButton,
  HeadlineOneButton,
  HeadlineTwoButton,
  HeadlineThreeButton,
  UnorderedListButton,
  OrderedListButton,
  BlockquoteButton,
  CodeBlockButton
} from "draft-js-buttons";

import "./editor/customtoolbar.css";

const HeadlinesPicker = (props) => {
  React.useEffect(() => {
    const handleWindowClick = () => {
      onWindowClick();
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  const onWindowClick = () => props.onOverrideContent(undefined);

  const buttons = [HeadlineOneButton, HeadlineTwoButton, HeadlineThreeButton];
  return (
    <div>
      {buttons.map((Button, i) => (
        <Button key={i} {...props} />
      ))}
    </div>
  );
};

const HeadlinesButton = (props) => {
  const onClick = () => {
    props.onOverrideContent(HeadlinesPicker);
  };

  return (
    <div className="headline-button-wrapper">
      <button onClick={onClick} className="headline-button">
        H
      </button>
    </div>
  );
};

const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const plugins = [toolbarPlugin];
const text = "";

const CustomToolbarEditor = () => {
  const [editorState, setEditorState] = useState(createEditorStateWithText(text));
  const editorRef = useRef(null);

  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
  };

  const focus = () => {
    editorRef.current.focus();
  };

  return (
    <div className="editor-content">
      <div className="editor" onClick={focus}>
        <div className="custom-toolbar">
          <Toolbar>
            {(externalProps) => (
              <div>
                <BoldButton {...externalProps} />
                <ItalicButton {...externalProps} />
                <UnderlineButton {...externalProps} />
                <CodeButton {...externalProps} />
                <Separator {...externalProps} />
                <HeadlinesButton {...externalProps} />
                <UnorderedListButton {...externalProps} />
                <OrderedListButton {...externalProps} />
                <BlockquoteButton {...externalProps} />
                <CodeBlockButton {...externalProps} />
              </div>
            )}
          </Toolbar>
        </div>
        <Editor editorState={editorState} onChange={onChange} plugins={plugins} ref={editorRef} />
      </div>
    </div>
  );
};

export default CustomToolbarEditor;
