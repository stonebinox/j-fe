# Frontend

This is a sample frontend built with Typescript, React, and Vite.

## Setup

1. Clone this repo
2. Run `npm install`
3. Create a `.env` file and add `VITE_BACKEND_URL=http://localhost:3000` <- change this to match what your BE service is running on
4. Run `npm run dev` to start

## Explanation

The UI is meant to be super simple: one textbox for user input, one button to hit Analyze and one block to view the output.

I added an additional section to view past analysis outputs.This automatically updates when you run a new request.

In the interest of time, I added the history option (since we're now storing stuff in a DB anyway) and de-prioritised filters, tests, and docker.

---
