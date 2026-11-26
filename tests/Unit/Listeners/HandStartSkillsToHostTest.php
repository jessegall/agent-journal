<?php

declare(strict_types=1);

namespace Tests\Unit\Listeners;

use App\Agents\Drivers\DefaultDrivers;
use App\Events\Sessions\StartGrantRequested;
use App\Listeners\HandStartSkillsToHost;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\StartAdditions;
use App\Skills\Data\GeneratedSkillData;
use App\Skills\Enums\GenerationStatus;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A grant hands the host exactly the skills its session was handed, straight from the generation and in its driver's
 * layout; a session handed no generation hands nothing, and a grant never waits on a delivery.
 */
final class HandStartSkillsToHostTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_claude_code_grant_hands_each_handed_key_the_plugin_file_and_the_plugin_dir_argument(): void
    {
        $session = $this->handedSession(DefaultDrivers::CLAUDE_CODE, ['journal']);

        $folder = $this->grantOf($session)->folders()[0];

        $this->assertSame('journal-skills', $folder->name);
        $this->assertSame(['--plugin-dir'], $folder->arguments);
        $this->assertSame(
            ['skills/journal/SKILL.md', '.claude-plugin/plugin.json'],
            array_map(fn ($file) => $file->path, $folder->files),
        );
        $this->assertSame("# journal\n", $folder->files[0]->content);
    }

    public function test_a_codex_grant_hands_the_skill_in_the_settings_folder_and_no_argument(): void
    {
        $session = $this->handedSession(DefaultDrivers::CODEX, ['journal-plans']);

        $folder = $this->grantOf($session)->folders()[0];

        $this->assertSame('skills', $folder->name);
        $this->assertSame([], $folder->arguments);
        $this->assertSame(['journal-plans/SKILL.md'], array_map(fn ($file) => $file->path, $folder->files));
    }

    public function test_a_session_handed_no_generation_hands_nothing(): void
    {
        $session = $this->sessionOnDriver(DefaultDrivers::CLAUDE_CODE);

        $this->assertSame([], $this->grantOf($session)->folders());
    }

    public function test_two_grants_of_one_session_hand_identical_files(): void
    {
        $session = $this->handedSession(DefaultDrivers::CLAUDE_CODE, ['journal', 'journal-plans']);

        $this->assertEquals($this->grantOf($session)->folders(), $this->grantOf($session)->folders());
    }

    /**
     * @param  list<string>  $keys
     */
    private function handedSession(string $driver, array $keys): AgentSession
    {
        $generation = SkillGeneration::create(
            str_repeat('e', 64),
            GenerationStatus::Ready,
            hash('sha256', 'text'),
            GeneratedSkillData::collect(array_map(fn (string $key) => [
                'key' => $key,
                'owner' => 'Core',
                'revision' => null,
                'markdown' => "# {$key}\n",
                'digest' => hash('sha256', "# {$key}\n"),
            ], ['journal', 'journal-plans', 'journal-tasks'])),
            null,
        );
        $session = $this->sessionOnDriver($driver);
        $session->recordSkills($generation, $keys);

        return $session;
    }

    private function sessionOnDriver(string $driver): AgentSession
    {
        $agent = Agent::create('Writer', 'read-only-helper', $this->localProject());
        $session = new AgentSession()->forceFill(TestSelections::sessionColumns($driver));
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function grantOf(AgentSession $session): StartAdditions
    {
        $additions = new StartAdditions();
        $this->app->make(HandStartSkillsToHost::class)->handle(new StartGrantRequested($session->id, $additions));

        return $additions;
    }
}
