<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Support\ContextReminders;
use App\Skills\Listeners\AdmitLaunchSkills;
use App\Skills\Listeners\RecordProvenSkillReads;
use App\Skills\Listeners\RefreshSessionSkills;
use App\Skills\Readers\SkillStatusReader;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use App\Skills\Values\SessionSkillStatus;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * skill:status shows each stage of one session's skill on its own: selected, delivered and not yet read, then read
 * after a whole read, and after an edit selected with a new digest and not read.
 */
final class SessionSkillStatusTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_receipts',
        'skill_context_epochs',
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

    protected function setUp(): void
    {
        parent::setUp();

        $this->root = sys_get_temp_dir().'/journal-skills-'.bin2hex(random_bytes(6));
        File::makeDirectory($this->root, recursive: true);
        $this->root = (string) realpath($this->root);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(7)));
        $this->app->instance(AgentStack::class, new RecordingStack());
        $this->artisan('skill:make', [
            'key' => 'user-guide',
            '--description' => 'The guide',
            '--body' => "# Guide\n\nFirst text.\n",
        ])->assertSuccessful();
        $this->app->make(SkillPublishing::class)->refresh();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_a_skill_is_delivered_then_read_and_an_edit_makes_it_unread_with_a_new_digest(): void
    {
        $session = $this->launchedMainAgent();

        $guide = $this->guideOf($session);
        $this->assertTrue($guide->selected);
        $this->assertSame(1, $guide->storedRevision);
        $this->assertSame('delivered', $guide->deliveryState);
        $this->assertFalse($guide->loaded);
        $firstDigest = $guide->generatedDigest;

        $this->app->make(RecordProvenSkillReads::class)->handle(new ToolCallFinished(
            new StackTarget($session->agent_id, $session->id),
            new ToolResult('mcp__journal__skills_show', ToolOutcome::Succeeded, ['key' => 'user-guide']),
        ));
        $this->assertTrue($this->guideOf($session)->loaded);

        $this->artisan('skill:edit', [
            'number' => 'user-guide',
            '--expected-revision' => 1,
            '--body' => "# Guide\n\nSecond text.\n",
        ])->assertSuccessful();
        $this->boundary($session);

        $edited = $this->guideOf($session);
        $this->assertTrue($edited->selected);
        $this->assertSame(2, $edited->storedRevision);
        $this->assertNotSame($firstDigest, $edited->generatedDigest);
        $this->assertFalse($edited->loaded);
        $this->assertTrue($edited->needsNewSession);

        $this->artisan('skill:status', ['--session' => $session->id])
            ->expectsOutputToContain('user-guide')
            ->assertSuccessful();
    }

    private function guideOf(AgentSession $session): SessionSkillStatus
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
        $rows = $this->app->make(SkillStatusReader::class)->skillsOfSession($session->id);
        $guide = array_values(array_filter($rows, fn (SessionSkillStatus $row) => $row->key === 'user-guide'));
        $this->assertCount(1, $guide);

        return $guide[0];
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

    private function boundary(AgentSession $session): void
    {
        $this->app->forgetScopedInstances();
        $this->app->make(RefreshSessionSkills::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $this->app->make(ContextReminders::class),
        ));
    }
}
