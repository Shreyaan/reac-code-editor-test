/* eslint-disable @typescript-eslint/no-explicit-any */
import { type SetStateAction, useRef, useState, useEffect, use } from "react";

import Editor from "@monaco-editor/react";

import { useLocalStorage, useEffectOnce } from "usehooks-ts";

function IFrameDemo() {
  const [language, setLanguage] = useState("html");

  const [html, setHtml] = useLocalStorage("html", "<h1>Hello World</h1>");
  const [css, setCss] = useLocalStorage(
    "css",
    `h1{
      color: red;
    }`
  );
  const [js, setJs] = useLocalStorage("js", "//alert('Hello World')");

  const [code, setCode] = useState(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            ${css}
        </style>
    </head>
    <body>
        ${html}
        <script>
            ${js}
        </script>
    </body>
    </html>`);

  const outputRef = useRef(null) as unknown as { current: HTMLIFrameElement };

  function handleEditorChange(
    value: SetStateAction<string | undefined>,
    event: any
  ) {
    if (typeof value === "string") {
      if (language === "html") {
        setHtml(value);
      }
      if (language === "css") {
        setCss(value);
      }
      if (language === "js") {
        setJs(value);
      }
    }
  }

  useEffect(() => {
    setCode(
      `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
              ${css}
          </style>
      </head>
      <body>
          ${html}
          <script>
              ${js}
          </script>
      </body>
      </html>`
    );
  }, [html, css, js, setCode]);

  const handleRunCode = () => {
    const iframe = outputRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

    iframeDoc?.open();
    iframeDoc?.write(code);
    iframeDoc?.close();
  };

  useEffectOnce(() => {
    //sleep for 1 second
    setTimeout(() => {
      handleRunCode();
    }, 500);
  });

  const handleKeyDown = (event: {
    preventDefault: () => void;
    which: number;
    ctrlKey: any;
    metaKey: any;
  }) => {
    const charCode = String.fromCharCode(event.which).toLowerCase();
    if ((event.ctrlKey || event.metaKey) && charCode === "s") {
      event.preventDefault();
      handleRunCode();
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-90">
        <div className="tabs tabs-boxed">
          <a
            className={`tab ${language === "html" ? "tab-active" : ""}`}
            onClick={() => {
              setLanguage("html");
            }}
          >
            html
          </a>
          <a
            className={`tab ${language === "css" ? "tab-active" : ""}`}
            onClick={() => {
              setLanguage("css");
            }}
          >
            css
          </a>
          <a
            className={`tab ${language === "js" ? "tab-active" : ""}`}
            onClick={() => {
              setLanguage("js");
            }}
          >
            js
          </a>
        </div>
        <div className="" onKeyDown={handleKeyDown}>
          {language === "html" && (
            <Editor
              height="50vh"
              defaultLanguage="html"
              onChange={handleEditorChange}
              value={html}
            />
          )}
          {language === "css" && (
            <Editor
              height="50vh"
              defaultLanguage="css"
              onChange={handleEditorChange}
              value={css}
            />
          )}
          {language === "js" && (
            <Editor
              height="50vh"
              defaultLanguage="javascript"
              onChange={handleEditorChange}
              value={js}
            />
          )}
        </div>
      </div>
      <button
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white"
        onClick={handleRunCode}
      >
        Run Code
      </button>
      <iframe className="h-80" title="output" ref={outputRef} />
    </div>
  );
}

export default IFrameDemo;
