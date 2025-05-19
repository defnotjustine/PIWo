import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "https://bookstor3.web.app",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
