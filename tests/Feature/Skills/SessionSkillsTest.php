<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\AgentRole;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Support\ContextReminders;
use App\Skills\Listeners\AdmitLaunchSkills;
use App\Skills\Listeners\RefreshSessionSkills;
use App\Skills\Models\SkillPublication;
use App\Skills\States\Support\AwaitingSkillsStateReference;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Each boundary of a running session selects its skills afresh: a skill that starts to apply joins the set and a
 * retargeted one leaves it, a set that waits holds the session's file changes, and a program that loads skills only
 * at a new session is told so.
 */
final class SessionSkillsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'command_receipts',
        'agents',
        'agent_sessions',
    ];

    private string $root;

    private RecordingStack $stack;

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/journal-skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root, recursive: true);
        $this->root = (string) realpath($this->root);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(7)));
        $this->stack = new RecordingStack();
        $this->app->instance(AgentStack::class, $this->stack);
        $this->app->make(SkillPublishing::class)->refresh();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_a_skill_that_starts_to_apply_joins_and_a_retargeted_one_leaves_at_the_next_boundary(): void
    {
        $session = $this->launchedMainAgent();
        $this->assertNotContains('user-probe', $this->latestKeys($session));

        $this->artisan('skill:make', ['key' => 'user-probe', '--body' => "# Probe\n\nProbe text.\n", '--main-agent' => true])
            ->assertSuccessful();
        $reminders = $this->boundary($session);

        $this->assertContains('user-probe', $this->latestKeys($session));
        $this->assertStringContainsString('start a new session', implode("\n", $reminders->all()));

        $this->artisan('skill:edit', ['number' => 'user-probe', '--expected-revision' => 1, '--type' => ['read_only_helper']])
            ->assertSuccessful();
        $this->boundary($session);

        $this->assertNotContains('user-probe', $this->latestKeys($session));
    }

    public function test_a_set_that_waits_holds_the_session_and_an_unchanged_one_does_not(): void
    {
        $session = $this->launchedMainAgent();
        $this->boundary($session);
        $this->assertSame([], $this->stack->pushed);

        $this->artisan('skill:make', ['key' => 'user-probe', '--body' => "# Probe\n\nProbe text.\n"])->assertSuccessful();
        $this->boundary($session);

        $this->assertCount(1, $this->stack->pushed);
        $this->assertSame(AwaitingSkillsStateReference::TYPE_KEY, $this->stack->pushed[0]->typeKey);
    }

    private function launchedMainAgent(): AgentSession
    {
        $agent = Agent::named('Main', AgentRole::MainAgent);
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitLaunchSkills::class)->handle(
            new LaunchStarted($agent->id, $session->id, AgentRole::MainAgent->value),
        );

        return $session;
    }

    private function boundary(AgentSession $session): ContextReminders
    {
        $reminders = $this->app->make(ContextReminders::class);
        $this->app->make(RefreshSessionSkills::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $reminders,
        ));

        return $reminders;
    }

    /**
     * @return list<string>
     */
    private function latestKeys(AgentSession $session): array
    {
        return SkillPublication::latestOfSession($session->id)?->skill_keys ?? [];
    }
}
