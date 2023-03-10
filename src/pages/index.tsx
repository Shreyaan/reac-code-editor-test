/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SetStateAction, useRef, useState } from "react";

import Editor from "@monaco-editor/react";

import { useLocalStorage } from "usehooks-ts";

function IFrameDemo() {
  const [code, setCode] = useLocalStorage(
    "code",
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <h1>Hello World</h1>
        <script>
            // create alert
            // alert("Hello World");
        </script>
    </body>
    </html>`
  );
  const outputRef = useRef(null) as unknown as { current: HTMLIFrameElement };

  function handleEditorChange(
    value: SetStateAction<string | undefined>,
    event: any
  ) {
    if (typeof value === "string") setCode(value);
  }

  const handleRunCode = () => {
    const iframe = outputRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    iframeDoc?.open();
    iframeDoc?.write(code);
    iframeDoc?.close();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-80">
        <Editor
          height="100%"
          defaultLanguage="html"
          
          onChange={handleEditorChange}
          value={code}
        />
      </div>
      <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white"
        onClick={handleRunCode}
      >
       Save and Run Code
      </button>
      <iframe className="h-80" title="output" ref={outputRef} />
    </div>
  );
}

export default IFrameDemo;
