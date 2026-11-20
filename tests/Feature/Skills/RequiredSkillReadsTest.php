<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\SessionStatus;
use App\Agents\Events\SessionOpened;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StackTarget;
use App\Bus\Contracts\CommandBus;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Events\ContextStarted;
use App\Hooks\Support\ContextReminders;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Values\ProfileBase;
use App\Skills\Listeners\AdmitStartSkills;
use App\Skills\Listeners\RefreshSessionSkills;
use App\Skills\Listeners\RemindRequiredSkills;
use App\Skills\Support\SkillPublishing;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\ActsAsActors;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\Skills\FinishesToolCalls;
use Tests\Support\Skills\HasSkillTargets;
use Tests\Support\Skills\MakesUserGuideSkill;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A required skill is asked for until its delivered text is read whole in the context: reading it clears the
 * reminder, an unchanged refresh asks nothing, and an edited text is asked for again.
 */
final class RequiredSkillReadsTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;
    use FinishesToolCalls;
    use HasContainerSupport;
    use HasSkillTargets;
    use MakesUserGuideSkill;

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

    public function test_an_edited_required_skill_is_asked_for_again_and_reading_it_clears_the_reminder(): void
    {
        $session = $this->startedReviewer();

        $this->assertReminded($this->boundary($session));

        $this->finished($session, 'mcp__journal__skills_show', ['key' => 'user-guide']);
        $this->assertNotReminded($this->boundary($session));

        $this->app->make(SkillPublishing::class)->refresh();
        $this->assertNotReminded($this->boundary($session));

        $this->artisan('skill:edit', [
            'number' => 'user-guide',
            '--expected-revision' => 1,
            '--body' => <<<'TEXT'
            # Guide

            Second text.

            TEXT,
        ])->assertSuccessful();
        $this->assertReminded($this->boundary($session));
    }

    private function startedReviewer(): AgentSession
    {
        $this->actAs(TestActors::user(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: ['user-guide'],
            ),
        )));
        $agent = Agent::create('Reviewer', 'read-only-helper');
        $session = new AgentSession([
            ...TestSelections::sessionColumns(),
            'profile_key' => 'journal-reviewer',
            'profile_revision' => 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();
        $this->app->make(AdmitStartSkills::class)->handle(
            new SessionOpened($agent->id, $session->id),
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
