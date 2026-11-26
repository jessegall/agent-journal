<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeSkills;
use App\Bus\Contracts\CommandBus;
use App\Events\Hooks\ContextStarted;
use App\Events\Sessions\SessionOpened;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\ReminderContribution;
use App\Listeners\AdmitStartSkills;
use App\Listeners\AdvanceSkillContext;
use App\Listeners\RemindRequiredSkills;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillGeneration;
use App\Models\Skills\SkillReceipt;
use App\Profiles\Commands\ActivateProfiles\ActivateProfilesCommand;
use App\Sessions\Enums\SessionStatus;
use App\Skills\Commands\RecordSkillRead\RecordSkillReadCommand;
use App\Skills\Enums\ReadEvidence;
use App\Support\DomainRegistry;
use App\Values\ProfileBase;
use App\Values\StackTarget;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Skills\AdmitsMainAgentSkills;
use Tests\Support\Skills\FinishesToolCalls;
use Tests\Support\Skills\MakesUserGuideSkill;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A proven whole read of a delivered skill leaves one receipt with the delivered digest; a listing leaves none; after
 * a compaction the skill reads as unread.
 */
#[TestsCommand(RecordSkillReadCommand::class)]
final class RecordSkillReadTest extends TestCase
{
    use AdmitsMainAgentSkills;
    use CommitsHookRows;
    use FinishesToolCalls;
    use HasContainerSupport;
    use MakesUserGuideSkill;

    private const array TABLES = [
        'skill_receipts',
        'skill_context_epochs',
        'skill_generations',
        'command_receipts',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
        'skill_requests',
        'skill_revisions',
        'skills',
    ];

    private const string REMINDER = 'Read the required skill user-guide';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installProfiles();
    }

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_a_skill_tool_read_records_one_receipt_with_the_delivered_digest(): void
    {
        $session = $this->startedMainAgent();
        $digest = $this->deliveredDigest($session, 'journal-plans');

        $this->finished($session, 'Skill', ['skill' => 'journal-session-skills:journal-plans']);
        $this->finished($session, 'Skill', ['skill' => 'journal-session-skills:journal-plans']);

        $receipts = SkillReceipt::query()->where('session_id', $session->id)->get();
        $this->assertCount(1, $receipts);
        $this->assertSame('journal-plans', $receipts[0]->skill_key);
        $this->assertSame($digest, $receipts[0]->content_digest);
        $this->assertSame(ReadEvidence::ClaudeSkillTool, $receipts[0]->evidence);
        $this->assertTrue(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));
    }

    public function test_a_directory_listing_records_none(): void
    {
        $session = $this->startedMainAgent();

        $this->finished($session, 'Bash', ['command' => "ls {$this->root}/targets"]);

        $this->assertSame(0, SkillReceipt::query()->where('session_id', $session->id)->count());
    }

    public function test_after_a_compaction_the_skill_reads_as_unread(): void
    {
        $session = $this->startedMainAgent();
        $digest = $this->deliveredDigest($session, 'journal-plans');
        $this->finished($session, 'Skill', ['skill' => ClaudeCodeSkills::PLUGIN_NAME.':journal-plans']);
        $this->assertTrue(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));

        $this->app->make(AdvanceSkillContext::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-compact',
            ContextStartType::Compact,
            $this->app->make(ReminderContribution::class),
        ));

        $this->assertFalse(SkillReceipt::hasRead($session->id, 'journal-plans', $digest));
    }

    public function test_a_required_skill_is_asked_for_until_read_and_an_edit_after_the_start_asks_nothing_more(): void
    {
        $session = $this->startedReviewer();

        $this->assertReminded($this->boundary($session));

        $this->finished($session, 'Skill', ['skill' => ClaudeCodeSkills::PLUGIN_NAME.':user-guide']);
        $this->assertNotReminded($this->boundary($session));

        $this->journal->refreshSkills();
        $this->assertNotReminded($this->boundary($session));

        $this->artisan('skill:edit', [
            'number' => 'user-guide',
            '--expected-revision' => 1,
            '--body' => <<<'TEXT'
            # Guide

            Second text.

            TEXT,
        ])->assertSuccessful();
        $this->assertNotReminded($this->boundary($session));
    }

    private function deliveredDigest(AgentSession $session, string $key): string
    {
        $generationId = AgentSession::findById($session->id)->skill_generation_id;
        $this->assertNotNull($generationId);
        $entry = SkillGeneration::findById($generationId)->entry($key);
        $this->assertNotNull($entry);

        return $entry->digest;
    }

    /**
     * @param  list<string>  $reminders
     */
    private function assertNotReminded(array $reminders): void
    {
        $this->assertStringNotContainsString(self::REMINDER, implode("\n", $reminders));
    }

    /**
     * A boundary is a hook call of its own: a new request scope that refreshes the session's set, then reminds.
     *
     * @return list<string>
     */
    private function boundary(AgentSession $session): array
    {
        $this->app->forgetScopedInstances();
        $reminders = $this->app->make(ReminderContribution::class);
        $event = new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $reminders,
        );
        $this->app->make(RemindRequiredSkills::class)->handle($event);

        return $reminders->all();
    }

    private function startedReviewer(): AgentSession
    {
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: ['user-guide'],
            ),
        )));
        $agent = Agent::create('Reviewer', 'read-only-helper', $this->localProject());
        $session = new AgentSession()->forceFill([
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
     * @param  list<string>  $reminders
     */
    private function assertReminded(array $reminders): void
    {
        $this->assertStringContainsString(self::REMINDER, implode("\n", $reminders));
    }
}
