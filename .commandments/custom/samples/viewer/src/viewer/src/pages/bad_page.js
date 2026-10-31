// @righteous architecture_viewer_WindowDrawnOutsideStageDetector
import PaneStage from "../windows/PaneStage.vue";
// @sin architecture_viewer_WindowDrawnOutsideStageDetector
import WindowPane from "../windows/WindowPane.vue";
// @sin architecture_viewer_LayoutFunctionInPageDetector
import {placed} from "../domain/panes.js";
// @righteous architecture_viewer_LayoutFunctionInPageDetector
import {useHomeLayout} from "../windows/homeLayout.js";

export const stage = [PaneStage, WindowPane, placed, useHomeLayout];
