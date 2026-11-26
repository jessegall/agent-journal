import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const renamer = path.join(__dirname, 'rename-frontend.cjs');

const component = `<template>
  <ul>
    <li v-for="item in footItems" :key="item">{{ item }}</li>
  </ul>
  <p v-if="footItems.length === 0">Nothing</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const footItems = computed(() => ['one', 'two']);
const count = computed(() => footItems.value.length);
</script>
`;

const renamed = `<template>
  <ul>
    <li v-for="item in bottomItems" :key="item">{{ item }}</li>
  </ul>
  <p v-if="bottomItems.length === 0">Nothing</p>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const bottomItems = computed(() => ['one', 'two']);
const count = computed(() => bottomItems.value.length);
</script>
`;

let project = '';

afterEach(() => rmSync(project, { recursive: true, force: true }));

describe('rename-frontend.cjs', () => {
    it('renames a script setup computed at its own offsets and in every template use', () => {
        project = mkdtempSync(path.join(tmpdir(), 'rename-frontend-'));
        writeFileSync(path.join(project, 'tsconfig.json'), JSON.stringify({ compilerOptions: { strict: true }, include: ['*.vue'] }));
        writeFileSync(path.join(project, 'Navigation.vue'), component);
        writeFileSync(path.join(project, 'renames.txt'), 'Navigation.vue:11 footItems bottomItems\n');

        execFileSync('node', [renamer, `--project=${project}`, `--list=${path.join(project, 'renames.txt')}`]);

        expect(readFileSync(path.join(project, 'Navigation.vue'), 'utf8')).toBe(renamed);
    });
});
