import {dated, wordLabel} from "@journal/window-kit";

const ROW_MODELS = {doc: "Document", report: "Report", plan: "Plan"};

export const rowModelLabel = (model) => ROW_MODELS[model] ?? wordLabel(model);
export const endsLabel = (expiresAt) => (expiresAt ? `ends ${dated(expiresAt)}` : "never ends");
