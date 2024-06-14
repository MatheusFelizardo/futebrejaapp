import { useDataStore } from "~/stores/data";

export default defineNuxtPlugin((NuxtApp) => {
  return {
    provide: {
      dataStore: useDataStore(),
    },
  };
});
