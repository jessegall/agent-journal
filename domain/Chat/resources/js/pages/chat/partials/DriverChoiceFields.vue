<script setup lang="ts">
import { Link } from "@inertiajs/vue3";
import SegmentedControl from "@kit/SegmentedControl";
import Select from "@kit/Select";
import { accountsPage } from "@kit/sessionStarts";
import type { DriverChoiceState } from "../../../composables/useDriverChoice";

/**
 * The Driver, Account and Model rows a new chat and a driver switch share. Only a signed-in account can be picked,
 * another shows as needing sign-in; with none of the driver connected the row says so and links to Accounts.
 */
defineProps<{ picker: DriverChoiceState }>();
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex items-center gap-3">
      <span class="w-24 text-small text-text-3">Driver</span>
      <SegmentedControl
        :model-value="picker.family.value ?? ''"
        label="Driver"
        :items="picker.driverOptions.value"
        data-driver
        @update:model-value="(family: string) => (picker.family.value = family)"
      />
    </div>
    <div class="flex items-center gap-3">
      <span class="w-24 text-small text-text-3">Account</span>
      <template v-if="picker.signedIn.value.length > 0">
        <Select
          :model-value="picker.accountId.value"
          :options="picker.accountOptions.value"
          aria-label="Account"
          data-account
          class="flex-1"
          @update:model-value="(id: string | null) => (picker.accountId.value = id)"
        />
      </template>
      <template v-else>
        <span class="text-small text-text-2" data-no-account
          >No {{ picker.driverLabel.value }} account is connected.
          <Link :href="accountsPage.url()" class="underline">Add one on Accounts</Link></span
        >
      </template>
    </div>
    <div class="flex items-center gap-3">
      <span class="w-24 text-small text-text-3">Model</span>
      <Select
        :model-value="picker.model.value"
        :options="picker.modelOptions.value"
        aria-label="Model"
        data-model
        class="flex-1"
        @update:model-value="(chosen: string | null) => (picker.model.value = chosen)"
      />
    </div>
    <template v-if="picker.readFailure.value">
      <p class="text-small text-danger" role="alert">{{ picker.readFailure.value }}</p>
    </template>
  </div>
</template>
