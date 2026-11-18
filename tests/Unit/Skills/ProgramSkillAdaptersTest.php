<?php

declare(strict_types=1);

namespace Tests\Unit\Skills;

use App\Programs\Values\ProgramKey;
use App\Skills\Enums\SkillReload;
use App\Skills\Exceptions\ProgramSkillsUnsupported;
use App\Skills\Programs\ClaudeCodeSkills;
use App\Skills\Programs\CodexSkills;
use App\Skills\Programs\ProgramSkillAdapters;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\LaunchSkillSet;
use App\Skills\Values\PublishedSkill;
use App\Skills\Values\SkillKey;
use Tests\TestCase;

/**
 * Each program's skill adapter gives the target, launch additions and layout report 171 found: a --plugin-dir plugin
 * folder for Claude Code, the isolated CODEX_HOME skills folder for Codex; a program without an adapter is refused.
 */
final class ProgramSkillAdaptersTest extends TestCase
{
    private const string SESSION = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(SkillTargets::class, new SkillTargets('/journal/skills'));
    }

    public function test_claude_code_gets_a_plugin_folder_and_is_sent_to_the_file_while_skill_is_denied(): void
    {
        $claude = $this->adapters()->for(ProgramKey::from('claude-code'));
        $target = '/journal/skills/targets/'.self::SESSION.'/claude-code';
        $delivery = $claude->delivery($this->sampleSet());

        $this->assertInstanceOf(ClaudeCodeSkills::class, $claude);
        $this->assertSame($target, $delivery->target);
        $this->assertSame(['--plugin-dir', $target], $delivery->launchArguments);
        $this->assertSame([], $delivery->settingsLinks);
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
        $target = '/journal/skills/targets/'.self::SESSION.'/codex';
        $delivery = $codex->delivery($this->sampleSet());

        $this->assertInstanceOf(CodexSkills::class, $codex);
        $this->assertSame($target, $delivery->target);
        $this->assertSame([], $delivery->launchArguments);
        $this->assertSame(['skills' => $target], $delivery->settingsLinks);
        $this->assertSame('journal-plans/SKILL.md', $codex->skillFile(SkillKey::from('journal-plans')));
        $this->assertSame([], $codex->supportFiles());
        $this->assertStringContainsString(
            "{$target}/journal-plans/SKILL.md",
            $codex->instruction($this->published("{$target}/journal-plans/SKILL.md")),
        );
        $this->assertStringNotContainsString('.codex/skills', $delivery->target);
        $this->assertSame(SkillReload::NewSession, $codex->reloadMode());
    }

    public function test_a_program_without_an_adapter_is_refused_by_name(): void
    {
        $this->assertFalse($this->adapters()->supports(ProgramKey::from('gemini-cli')));
        $this->expectException(ProgramSkillsUnsupported::class);
        $this->expectExceptionMessage('gemini-cli');

        $this->adapters()->for(ProgramKey::from('gemini-cli'));
    }

    private function sampleSet(): LaunchSkillSet
    {
        return new LaunchSkillSet(self::SESSION, '/work/checkout', [$this->published('/ignored')]);
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
