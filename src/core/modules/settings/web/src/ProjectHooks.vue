<script setup>
import { computed, ref } from "vue";
import {READ_RATES, coalesced, Btn, WindowRoom, runChanged, useWindow} from "@journal/window-kit";
import HookDetails from "./HookDetails.vue";
import HookGroup from "./HookGroup.vue";
import ManagedHookRow from "./ManagedHookRow.vue";

const context = useWindow();
const { data: value, failure } = context.props.hooks;
const load = () => context.reload("hooks");
const busy = ref(false);
const asking = ref(false);
const restored = ref(false);
const failed = ref({ hook_id: null, text: "" });
const readOnly = computed(
  () => context.face === "phone" || context.readOnly === true,
);
const globalFailure = computed(() =>
  failed.value.hook_id === null ? failed.value.text : "",
);
const managedKey = (item) => item.hook.id;
const itemFailure = (item) =>
  failed.value.hook_id === item.hook.id ? failed.value.text : "";

async function act(words, hookId = null, change = null) {
  busy.value = true;
  failed.value = { hook_id: null, text: "" };
  try {
    const reply = await runChanged(change, words, context.run);
    failed.value = { hook_id: hookId, text: reply.ok ? "" : reply.error };
    if (reply.ok) await load();
    return reply;
  } finally {
    busy.value = false;
  }
}

const save = (hook, change) =>
  act(
    [
      "managed-hook",
      "set",
      change.hook_id,
      change.state,
      String(change.timeout),
    ],
    change.hook_id,
    { target: hook, fields: { state: change.state, timeout: change.timeout } },
  );
async function scan() {
  const reply = await act(["managed-hook", "scan"]);
  if (reply.ok) restored.value = false;
}
async function restore() {
  asking.value = false;
  const reply = await act(["managed-hook", "give-back"]);
  restored.value = reply.ok;
}

context.follow(["hook_call.*"], coalesced(load, READ_RATES.projectHooks));
</script>

<template>
  <WindowRoom>
    <div class="project-hooks">
      <p class="hook-intro">
        Run project commands when an agent program starts, uses a tool or stops.
        Edit commands and matchers in their source files.
      </p>
      <div class="hooks-actions">
        <Btn bordered :disabled="readOnly || busy" data-hooks-scan @click="scan"
          >Scan now</Btn
        >
        <Btn
          bordered
          :disabled="readOnly || busy"
          data-hooks-give-back
          @click="asking = true"
          >Stop managing all commands</Btn
        >
      </div>
      <template v-if="asking">
        <div class="hooks-confirm">
          <p>
            Return every command to its source file? Management is off until the
            next scan.
          </p>
          <Btn :disabled="busy" data-hooks-cancel @click="asking = false"
            >Cancel</Btn
          >
          <Btn
            variant="danger"
            :disabled="busy"
            data-hooks-confirm
            @click="restore"
            >Stop managing all commands</Btn
          >
        </div>
      </template>
      <template v-if="restored"
        ><p class="hook-notice">
          Management is off until the next scan.
        </p></template
      >
      <template v-if="failure || globalFailure"
        ><p class="hook-error" role="alert">
          {{ failure || globalFailure }}
        </p></template
      >
      <template v-if="value">
        <template v-if="value.fallback"
          ><p class="hook-notice" data-shell-fallback>
            The shell runner does not run managed project commands. Native
            commands stay in their files while it is in use.
          </p></template
        >
        <HookGroup
          title="Managed"
          :count="value.managed.length"
          empty="No managed commands"
        >
          <template v-for="item in value.managed" :key="managedKey(item)">
            <ManagedHookRow
              :hook="item.hook"
              :history="item.history"
              :disabled="readOnly || busy"
              :failure="itemFailure(item)"
              @save="save(item.hook, $event)"
            />
          </template>
        </HookGroup>
        <HookGroup
          title="Pending"
          :count="value.pending.length"
          empty="No pending commands"
        >
          <template v-for="hook in value.pending" :key="hook.id"
            ><div class="pending-hook"><HookDetails :hook="hook" /></div
          ></template>
        </HookGroup>
        <HookGroup
          title="Not managed"
          :count="value.unmanaged.length"
          empty="No excluded entries"
        >
          <template
            v-for="entry in value.unmanaged"
            :key="`${entry.program}:${entry.source}:${entry.event}`"
          >
            <div class="unmanaged-hook">
              <strong>{{ entry.program }}</strong>
              <code>{{ entry.source }}</code>
              <p>{{ entry.reason }}</p>
            </div>
          </template>
        </HookGroup>
      </template>
    </div>
  </WindowRoom>
</template>

<style scoped>
.project-hooks {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.hook-intro,
.hook-notice,
.hooks-confirm p {
  margin: 0;
  color: var(--text-2);
  font-size: 12px;
}
.hooks-actions,
.hooks-confirm {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.hooks-confirm,
.hook-notice {
  padding: 10px 12px;
  border: 1px solid var(--border-2);
  border-radius: 6px;
  background: var(--raised);
}
.hook-error {
  margin: 0;
  color: var(--danger);
  font-size: 12px;
}
.pending-hook,
.unmanaged-hook {
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
}
.unmanaged-hook {
  color: var(--text-2);
  font-size: 12px;
  overflow-wrap: anywhere;
}
.unmanaged-hook p {
  margin: 4px 0 0;
  color: var(--text-3);
}
</style>
