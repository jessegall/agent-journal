<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Programs\Values\ProgramKey;
use App\Skills\Enums\SkillReload;
use App\Skills\Exceptions\ProgramSkillsUnsupported;
use App\Skills\Programs\ClaudeCodeSkills;
use App\Skills\Programs\CodexSkills;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillKey;
use Tests\TestCase;

/**
 * Each program's skill adapter gives the folder, start additions and layout report 171 found: a --plugin-dir plugin
 * folder in the start's settings folder for Claude Code, the skills folder of the isolated CODEX_HOME for Codex; a
 * program without an adapter is refused.
 */
final class ProgramSkillAdaptersTest extends TestCase
{
    public function test_claude_code_gets_a_plugin_folder_and_is_sent_to_the_file_while_skill_is_denied(): void
    {
        $claude = $this->adapters()->for(ProgramKey::from('claude-code'));
        $target = '/host/runtimes/01jd8x0g9m3qz6v4k2t7r5w1cf/journal-skills';
        $delivery = $claude->delivery();

        $this->assertInstanceOf(ClaudeCodeSkills::class, $claude);
        $this->assertSame('journal-skills', $delivery->folder);
        $this->assertSame(['--plugin-dir'], $delivery->folderArguments);
        $this->assertSame('skills/journal-plans/SKILL.md', $claude->skillFile(SkillKey::from('journal-plans')));
        $plugin = json_decode($claude->supportFiles()['.claude-plugin/plugin.json'], true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame('journal-session-skills', $plugin['name']);
        $file = "{$target}/skills/journal-plans/SKILL.md";
        $this->assertSame(
            "Read the skill journal-plans with the Read tool at {$file} before work it covers.",
            $claude->instruction($this->published($file)),
        );
        $this->assertSame(SkillReload::NewSession, $claude->reloadMode());
    }

    public function test_codex_gets_its_codex_home_skills_folder_linked_to_the_target_and_the_absolute_path(): void
    {
        $codex = $this->adapters()->for(ProgramKey::from('codex'));
        $target = '/host/runtimes/01jd8x0g9m3qz6v4k2t7r5w1cf/skills';
        $delivery = $codex->delivery();

        $this->assertInstanceOf(CodexSkills::class, $codex);
        $this->assertSame('skills', $delivery->folder);
        $this->assertSame([], $delivery->folderArguments);
        $this->assertSame('journal-plans/SKILL.md', $codex->skillFile(SkillKey::from('journal-plans')));
        $this->assertSame([], $codex->supportFiles());
        $this->assertStringContainsString(
            "{$target}/journal-plans/SKILL.md",
            $codex->instruction($this->published("{$target}/journal-plans/SKILL.md")),
        );
        $this->assertStringNotContainsString('.codex', $delivery->folder);
        $this->assertSame(SkillReload::NewSession, $codex->reloadMode());
    }

    public function test_a_program_without_an_adapter_is_refused_by_name(): void
    {
        $this->assertFalse($this->adapters()->supports(ProgramKey::from('gemini-cli')));
        $this->expectException(ProgramSkillsUnsupported::class);
        $this->expectExceptionMessage('gemini-cli');

        $this->adapters()->for(ProgramKey::from('gemini-cli'));
    }

    private function published(string $path): PublishedSkill
    {
        return new PublishedSkill(SkillKey::from('journal-plans'), str_repeat('a', 64), $path);
    }

    private function adapters(): ProgramSkillAdapters
    {
        return $this->app->make(ProgramSkillAdapters::class);
    }
}
