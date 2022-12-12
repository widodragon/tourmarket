import React from "react";
import MyRouter from "routers/index";
import { Helmet } from "react-helmet";

function App() {
  return (
    <div className="bg-white text-base dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200">
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"></meta>
      </Helmet>
      <MyRouter />
    </div>
  );
}

export default App;
