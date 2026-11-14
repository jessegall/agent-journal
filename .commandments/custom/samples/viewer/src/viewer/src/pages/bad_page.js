// @righteous architecture_viewer_window_drawn_outside_stage
import PaneStage from "../windows/PaneStage.vue";
// @sin architecture_viewer_window_drawn_outside_stage
import WindowPane from "../windows/WindowPane.vue";
// @sin architecture_viewer_layout_function_in_page
import {placed} from "../domain/panes.js";
// @righteous architecture_viewer_layout_function_in_page
import {useHomeLayout} from "../windows/homeLayout.js";

export const stage = [PaneStage, WindowPane, placed, useHomeLayout];
