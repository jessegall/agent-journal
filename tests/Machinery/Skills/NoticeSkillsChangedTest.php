<?php

declare(strict_types=1);

namespace Tests\Machinery\Skills;

use App\Bus\Contracts\CommandBus;
use App\Events\Hooks\ContextStarted;
use App\Events\Sessions\SessionOpened;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\ReminderContribution;
use App\Listeners\AdmitStartSkills;
use App\Listeners\NoticeSkillsChanged;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Sessions\Enums\SessionStatus;
use App\Skills\Values\SectionDraft;
use App\Skills\Values\SkillDraft;
use App\Values\AgentText;
use App\Values\ProfileBase;
use App\Values\StackTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestIds;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * At a boundary a session whose skills changed since its start is told to start a new session, and nothing else
 * changes: an unchanged catalogue says nothing, a selection that cannot be made is told and the session keeps working.
 */
#[TestsMachinery(NoticeSkillsChanged::class)]
final class NoticeSkillsChangedTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'skill_generations',
        'skill_requests',
        'skill_revisions',
        'skills',
        'number_groups',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    public function test_an_unchanged_catalogue_says_nothing(): void
    {
        $session = $this->startedWithSkills();

        $this->assertSame([], $this->boundary($session));
    }

    public function test_a_skill_made_after_the_start_notifies_the_agent_to_start_a_new_session_and_changes_nothing(): void
    {
        $session = $this->startedWithSkills();
        $handed = AgentSession::findById($session->id);

        $this->journal->owner()->skill('user-review-notes', new SkillDraft(
            'Review notes',
            'Read before reviewing.',
            [new SectionDraft('notes', 'Notes', 'Read the diff first.')],
            '',
        ));
        $this->journal->refreshSkills();

        $reminders = $this->boundary($session);

        $this->assertCount(1, $reminders);
        $this->assertMatchesRegularExpression(TestText::pattern(AgentText::of('core.skills.changed', [
            'skills' => TestText::ANY,
            'driver' => TestText::ANY,
        ])), $reminders[0]);
        $this->assertStringContainsString('user-review-notes', $reminders[0]);
        $after = AgentSession::findById($session->id);
        $this->assertSame($handed->skill_generation_id, $after->skill_generation_id);
        $this->assertSame($handed->skill_keys, $after->skill_keys);
    }

    public function test_a_selection_that_cannot_be_made_is_told_and_the_session_keeps_working(): void
    {
        $this->journal->refreshSkills();
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: ['no-such-skill'],
            ),
        )));
        $session = $this->handedSession(['profile_key' => 'journal-reviewer', 'profile_revision' => 1]);
        $session->recordSkills(SkillGeneration::findLatestReady(), ['journal']);

        $reminders = $this->boundary($session);

        $this->assertCount(1, $reminders);
        $this->assertMatchesRegularExpression(
            TestText::pattern(AgentText::of('core.skills.not_chosen', ['problem' => TestText::ANY])),
            $reminders[0],
        );
        $this->assertTrue(AgentSession::findById($session->id)->isActive());
    }

    private function startedWithSkills(): AgentSession
    {
        $this->journal->refreshSkills();
        $session = $this->handedSession([]);
        $this->app->make(AdmitStartSkills::class)->handle(new SessionOpened($session->agent_id, $session->id));

        return AgentSession::findById($session->id);
    }

    /**
     * @param  array<string, string|int>  $columns
     */
    private function handedSession(array $columns): AgentSession
    {
        $agent = Agent::create('Writer', 'main-agent', $this->localProject());
        $session = new AgentSession()->forceFill([...TestSelections::sessionColumns(), ...$columns]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    /**
     * A boundary is a hook call of its own: a new request scope that selects the skills afresh.
     *
     * @return list<string>
     */
    private function boundary(AgentSession $session): array
    {
        $this->app->forgetScopedInstances();
        $reminders = $this->app->make(ReminderContribution::class);
        $this->app->make(NoticeSkillsChanged::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $reminders,
        ));

        return $reminders->all();
    }
}
