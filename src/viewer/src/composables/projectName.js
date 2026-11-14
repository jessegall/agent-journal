import {computed, watchEffect} from "vue";
import {rememberedRef} from "../windows/rememberedState.js";

// the project's name, the last part of the environment's folder, as this browser last knew it, so it does not change or go
// blank while the server answers; every page shell that draws the sidebar's header or the breadcrumb reads it here
export function useProjectName(environments, environment) {
    const lastProject = rememberedRef("last-project", "");
    const project = computed(() => environments.value?.find?.((row) => row.name === environment)?.folder?.split("/").pop() || lastProject.value);
    watchEffect(() => (lastProject.value = project.value));
    return project;
}
