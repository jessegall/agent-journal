<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\ProgramToolInput;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Support\ContextReminders;
use App\Skills\Listeners\RecordProvenSkillReads;
use App\Skills\Listeners\RefreshSessionSkills;
use App\Skills\Resolvers\Support\SkillStatusResolver;
use App\Skills\Support\SkillPublishing;
use App\Skills\Values\SessionSkillStatus;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsBuiltInProfiles;
use Tests\Support\Skills\AdmitsMainAgentSkills;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * skill:status shows each stage of one session's skill on its own: selected, delivered and not yet read, then read
 * after a whole read, and after an edit selected with a new digest and not read.
 */
final class SessionSkillStatusTest extends TestCase
{
    use ActsAsActors;
    use AdmitsMainAgentSkills;
    use CommitsHookRows;
    use HasSkillTargets;
    use InstallsBuiltInProfiles;

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

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->app->instance(AgentStack::class, new RecordingStack());
        $this->artisan('skill:make', [
            'key' => 'user-guide',
            '--description' => 'The guide',
            '--body' => <<<'TEXT'
            # Guide

            First text.

            TEXT,
        ])->assertSuccessful();
        $this->app->make(SkillPublishing::class)->refresh();
    }

    public function test_a_skill_is_delivered_then_read_and_an_edit_makes_it_unread_with_a_new_digest(): void
    {
        $session = $this->startedMainAgent();

        $guide = $this->guideOf($session);
        $this->assertTrue($guide->selected);
        $this->assertSame(1, $guide->storedRevision);
        $this->assertSame('delivered', $guide->deliveryState);
        $this->assertFalse($guide->loaded);
        $firstDigest = $guide->generatedDigest;

        $this->app->make(RecordProvenSkillReads::class)->handle(new ToolCallFinished(
            new StackTarget($session->agent_id, $session->id),
            new ToolResult(
                'mcp__journal__skills_show',
                ToolOutcome::Succeeded,
                new ProgramToolInput(['key' => 'user-guide']),
            ),
        ));
        $this->assertTrue($this->guideOf($session)->loaded);

        $this->artisan('skill:edit', [
            'number' => 'user-guide',
            '--expected-revision' => 1,
            '--body' => <<<'TEXT'
            # Guide

            Second text.

            TEXT,
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
        $this->actAs(TestActors::user(7));
        $rows = $this->app->make(SkillStatusResolver::class)->skillsOfSession($session->id);
        $guide = array_values(array_filter($rows, fn (SessionSkillStatus $row) => $row->key === 'user-guide'));
        $this->assertCount(1, $guide);

        return $guide[0];
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
