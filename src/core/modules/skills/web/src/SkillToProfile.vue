<script setup>
import {CreateDialog, useWindow} from "@journal/window-kit";

// Require it in a profile: the agents of that profile must read the skill at the start, added to the ones it already requires and run as journal profile save
const props = defineProps({folder: {type: String, required: true}, profiles: {type: Array, required: true}});
const emit = defineEmits(["close"]);
const view = useWindow();
const fields = [{key: "profile", label: "Profile", kind: "select", options: props.profiles.map((profile) => [profile.name, profile.name]), required: true}];
const requiredBy = (name) => [...new Set([...(props.profiles.find((profile) => profile.name === name)?.required_skills ?? []), props.folder])].join(",");
const line = (values) => ["profile", "save", values.profile, "--required-skills", requiredBy(values.profile)];
const command = (values) => `journal profile save ${values.profile} --required-skills ${requiredBy(values.profile)}`;
</script>

<template>
    <CreateDialog :title="`Require ${folder} in a profile`" submit="Require it" :fields="fields" :command="command" :run="(values) => view.run(line(values))" @close="emit('close')" />
</template>
