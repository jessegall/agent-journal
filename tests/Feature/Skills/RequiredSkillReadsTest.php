<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\AgentRole;
use App\Agents\Enums\SessionStatus;
use App\Agents\Events\LaunchStarted;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Contracts\AgentStack;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Events\ToolCallFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Support\ContextReminders;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Enums\ProfileType;
use App\Skills\Listeners\AdmitLaunchSkills;
use App\Skills\Listeners\RecordProvenSkillReads;
use App\Skills\Listeners\RefreshSessionSkills;
use App\Skills\Listeners\RemindRequiredSkills;
use App\Skills\Support\SkillPublishing;
use App\Skills\Support\SkillTargets;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A required skill is asked for until its delivered text is read whole in the context: reading it clears the
 * reminder, an unchanged refresh asks nothing, and an edited text is asked for again.
 */
final class RequiredSkillReadsTest extends TestCase
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
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
    ];

    private const string REMINDER = 'Read the required skill user-guide';

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
            '--description' => 'The review guide',
            '--body' => "# Guide\n\nFirst text.\n",
        ])->assertSuccessful();
        $this->app->make(SkillPublishing::class)->refresh();
    }

    protected function tearDown(): void
    {
        File::deleteDirectory($this->root);

        parent::tearDown();
    }

    public function test_an_edited_required_skill_is_asked_for_again_and_reading_it_clears_the_reminder(): void
    {
        $session = $this->launchedReviewer();

        $this->assertReminded($this->boundary($session));

        $this->finished($session, 'mcp__journal__skills_show', ['key' => 'user-guide']);
        $this->assertNotReminded($this->boundary($session));

        $this->app->make(SkillPublishing::class)->refresh();
        $this->assertNotReminded($this->boundary($session));

        $this->artisan('skill:edit', [
            'number' => 'user-guide',
            '--expected-revision' => 1,
            '--body' => "# Guide\n\nSecond text.\n",
        ])->assertSuccessful();
        $this->assertReminded($this->boundary($session));
    }

    private function launchedReviewer(): AgentSession
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileType::ReadOnlyHelper,
                'Review.',
                requiredSkills: ['user-guide'],
            ),
        )));
        $agent = Agent::named('Reviewer', AgentRole::ReadOnlyHelper);
        $session = new AgentSession([
            ...TestSelections::sessionColumns(),
            'profile_key' => 'journal-reviewer',
            'profile_revision' => 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitLaunchSkills::class)->handle(
            new LaunchStarted($agent->id, $session->id, AgentRole::ReadOnlyHelper->value),
        );

        return $session;
    }

    /**
     * A boundary is a hook call of its own: a new request scope that refreshes the session's set, then reminds.
     *
     * @return list<string>
     */
    private function boundary(AgentSession $session): array
    {
        $this->app->forgetScopedInstances();
        $reminders = $this->app->make(ContextReminders::class);
        $event = new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $reminders,
        );
        $this->app->make(RefreshSessionSkills::class)->handle($event);
        $this->app->make(RemindRequiredSkills::class)->handle($event);

        return $reminders->all();
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function finished(AgentSession $session, string $tool, array $arguments): void
    {
        $this->app->make(RecordProvenSkillReads::class)->handle(new ToolCallFinished(
            new StackTarget($session->agent_id, $session->id),
            new ToolResult($tool, ToolOutcome::Succeeded, $arguments),
        ));
    }

    /**
     * @param  list<string>  $reminders
     */
    private function assertReminded(array $reminders): void
    {
        $this->assertStringContainsString(self::REMINDER, implode("\n", $reminders));
    }

    /**
     * @param  list<string>  $reminders
     */
    private function assertNotReminded(array $reminders): void
    {
        $this->assertStringNotContainsString(self::REMINDER, implode("\n", $reminders));
    }
}
