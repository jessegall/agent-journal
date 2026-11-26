<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Agents\Drivers\Codex\CodexSkills;
use App\Agents\Drivers\Skills\DriverSkillAdapters;
use App\Agents\Exceptions\DriverSkillsUnsupported;
use App\Skills\Enums\SkillReload;
use App\Values\DriverKey;
use App\Values\SkillKey;
use Tests\TestCase;

/**
 * Each driver's skill adapter gives the folder, start additions and layout each program reads: a --plugin-dir plugin
 * folder in the start's settings folder for Claude Code, the skills folder of the isolated CODEX_HOME for Codex; a
 * driver without an adapter is refused.
 */
final class ProgramSkillAdaptersTest extends TestCase
{
    public function test_claude_code_gets_a_plugin_folder_for_its_skills(): void
    {
        $claude = $this->adapters()->for(DriverKey::from('claude-code'));
        $delivery = $claude->delivery();

        $this->assertInstanceOf(ClaudeCodeSkills::class, $claude);
        $this->assertSame('journal-skills', $delivery->folder);
        $this->assertSame(['--plugin-dir'], $delivery->folderArguments);
        $this->assertSame('skills/journal-plans/SKILL.md', $claude->skillFile(SkillKey::from('journal-plans')));
        $plugin = json_decode($claude->supportFiles()['.claude-plugin/plugin.json'], true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame('journal-session-skills', $plugin['name']);
        $this->assertSame(SkillReload::NewSession, $claude->reloadMode());
    }

    public function test_codex_gets_its_codex_home_skills_folder(): void
    {
        $codex = $this->adapters()->for(DriverKey::from('codex'));
        $delivery = $codex->delivery();

        $this->assertInstanceOf(CodexSkills::class, $codex);
        $this->assertSame('skills', $delivery->folder);
        $this->assertSame([], $delivery->folderArguments);
        $this->assertSame('journal-plans/SKILL.md', $codex->skillFile(SkillKey::from('journal-plans')));
        $this->assertSame([], $codex->supportFiles());
        $this->assertStringNotContainsString('.codex', $delivery->folder);
        $this->assertSame(SkillReload::NewSession, $codex->reloadMode());
    }

    public function test_a_program_without_an_adapter_is_refused_by_name(): void
    {
        $this->assertFalse($this->adapters()->supports(DriverKey::from('gemini-cli')));
        $this->expectException(DriverSkillsUnsupported::class);
        $this->expectExceptionMessage('gemini-cli');

        $this->adapters()->for(DriverKey::from('gemini-cli'));
    }

    private function adapters(): DriverSkillAdapters
    {
        return $this->app->make(DriverSkillAdapters::class);
    }
}
