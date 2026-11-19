<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Assignments\Policies\AssignmentPolicy;
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
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\TestActors;
use Tests\Support\UsesTemporaryFolder;
use Tests\TestCase;

/**
 * Each boundary of a running session selects its skills afresh: a skill that starts to apply joins the set and a
 * retargeted one leaves it, a set that waits holds the session's file changes, and a program that loads skills only
 * at a new session is told so.
 */
final class SessionSkillsTest extends TestCase
{
    use CommitsHookRows;
    use InstallsBuiltInProfiles;
    use UsesTemporaryFolder;

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

    private RecordingStack $stack;

    protected function setUp(): void
    {
        parent::setUp();

        $this->makeTemporaryFolder('journal-skills');
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->stack = new RecordingStack();
        $this->app->instance(AgentStack::class, $this->stack);
        $this->app->make(SkillPublishing::class)->refresh();
    }

    public function test_a_skill_that_starts_to_apply_joins_and_a_retargeted_one_leaves_at_the_next_boundary(): void
    {
        $session = $this->launchedMainAgent();
        $this->assertNotContains('user-probe', $this->latestKeys($session));

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-probe',
                '--description' => 'A probe skill',
                '--body' => "# Probe\n\nProbe text.\n",
                '--ability' => [AssignmentPolicy::class.':dispatch'],
            ],
        )
            ->assertSuccessful();
        $reminders = $this->boundary($session);

        $this->assertContains('user-probe', $this->latestKeys($session));
        $this->assertStringContainsString('start a new session', implode("\n", $reminders->all()));

        $this->artisan(
            'skill:edit',
            ['number' => 'user-probe', '--expected-revision' => 1, '--base' => ['read-only-helper']],
        )
            ->assertSuccessful();
        $this->boundary($session);

        $this->assertNotContains('user-probe', $this->latestKeys($session));
    }

    public function test_a_set_that_waits_holds_the_session_and_an_unchanged_one_does_not(): void
    {
        $session = $this->launchedMainAgent();
        $this->boundary($session);
        $this->assertSame([], $this->stack->pushed);

        $this->artisan(
            'skill:make',
            ['key' => 'user-probe', '--description' => 'A probe skill', '--body' => "# Probe\n\nProbe text.\n"],
        )->assertSuccessful();
        $this->boundary($session);

        $this->assertCount(1, $this->stack->pushed);
        $this->assertSame(AwaitingSkillsStateReference::TYPE_KEY, $this->stack->pushed[0]->typeKey);
    }

    private function launchedMainAgent(): AgentSession
    {
        $agent = Agent::named('Main', 'main-agent');
        $session = new AgentSession(TestSelections::sessionColumns());
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitLaunchSkills::class)->handle(
            new LaunchStarted($agent->id, $session->id),
        );

        return $session;
    }

    /**
     * A boundary is a hook call of its own, so it starts a new request scope with a fresh catalogue.
     */
    private function boundary(AgentSession $session): ContextReminders
    {
        $this->app->forgetScopedInstances();
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
