<?php

declare(strict_types=1);

namespace Tests\Commands\Skills;

use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Skills\PublishSkills\PublishSkillsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Skills\SkillPublisher as SkillPublisherContract;
use App\Contracts\Work\AgentStacks;
use App\Enums\Files\Place;
use App\Enums\Hooks\ContextStartType;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Skills\PublicationStatus;
use App\Events\Hooks\ContextStarted;
use App\Events\Sessions\SessionOpened;
use App\Listeners\AdmitStartSkills;
use App\Listeners\RefreshSessionSkills;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentSession;
use App\Models\Skills\SkillPublication;
use App\Policies\AssignmentRecipientPolicy;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\DomainRegistry;
use App\Support\ReminderContribution;
use App\Support\SkillPublisher;
use App\Support\SkillPublishingService;
use App\Support\SkillTargets;
use App\Support\States\Support\AwaitSkillsStateReference;
use App\Values\OwnerAuthority;
use App\Values\ProfileBase;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\File;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Fixtures\Skills\FullDiskPublisher;
use Tests\Fixtures\Skills\RecordingStack;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Skills\AdmitsMainAgentSkills;
use Tests\Support\Skills\IntendsSkillPublications;
use Tests\Support\Skills\PublishesSkills;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * A pending publication is staged in bounded steps and activated by switching the journal's own pointer; a failed
 * write keeps the previous pointer, a target the journal does not own is left alone, and a stale worker stops.
 */
#[TestsCommand(PublishSkillsCommand::class)]
final class PublishSkillsTest extends TestCase
{
    use AdmitsMainAgentSkills;
    use CommitsHookRows;
    use HasContainerSupport;
    use IntendsSkillPublications;
    use PublishesSkills;
    use WithActiveAccount;

    private const string FIRST_TEXT = <<<'TEXT'
        # Journal

        First text.

        TEXT;

    private const string NO_SPACE = 'no space left';

    private const string OWN_SKILL = 'My own skill.';

    private const string FOREIGN_FILES = 'holds files the journal did not create';

    private const array TABLES = [
        'skill_publications',
        'skill_generations',
        'command_receipts',
        'skill_requests',
        'skill_revisions',
        'skills',
        'profile_revisions',
        'profiles',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    private RecordingStack $stack;

    private const string NEW_SESSION = 'start a new session';

    public function test_a_pending_publication_ends_delivered_with_skill_files_and_a_manifest_at_the_target(): void
    {
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationStatus::Delivered, $this->publishing()->publish($publication->id, 'worker-1'));

        $target = $this->target();
        $this->assertTrue(is_link($target));
        $this->assertSame(self::FIRST_TEXT, File::get("{$target}/skills/journal/SKILL.md"));
        $manifest = json_decode(File::get("{$target}/manifest.json"), true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame(hash('sha256', <<<'TEXT'
        # Journal

        First text.

        TEXT), $manifest['files']['skills/journal/SKILL.md']);
        $this->assertSame(PublicationStatus::Delivered, $publication->refresh()->status);
        $plugin = json_decode(File::get("{$target}/.claude-plugin/plugin.json"), true, flags: JSON_THROW_ON_ERROR);
        $this->assertSame('journal-session-skills', $plugin['name']);
    }

    public function test_a_failed_write_keeps_the_previous_pointer_and_records_failed(): void
    {
        $this->publishing()->publish($this->intend('First text.')->id, 'worker-1');
        $before = (string) readlink($this->target());
        $this->app->instance(
            SkillPublisherContract::class,
            new FullDiskPublisher($this->app->make(SkillPublisher::class)),
        );
        $second = $this->intend('Second text.');

        $this->assertSame(PublicationStatus::Failed, $this->publishing()->publish($second->id, 'worker-1'));
        $this->assertSame($before, readlink($this->target()));
        $this->assertSame(PublicationStatus::Failed, $second->refresh()->status);
        $this->assertStringContainsString(self::NO_SPACE, (string) $second->error);
    }

    public function test_an_unowned_skill_folder_at_the_target_is_refused_and_left_untouched(): void
    {
        File::makeDirectory($this->target().'/mine', recursive: true);
        File::put($this->target().'/mine/SKILL.md', 'My own skill.');
        $publication = $this->intend('First text.');

        $this->assertSame(PublicationStatus::Failed, $this->publishing()->publish($publication->id, 'worker-1'));
        $this->assertSame(self::OWN_SKILL, File::get($this->target().'/mine/SKILL.md'));
        $this->assertStringContainsString(
            self::FOREIGN_FILES,
            (string) $publication->refresh()->error,
        );
    }

    public function test_a_skill_that_starts_to_apply_joins_and_a_retargeted_one_leaves_at_the_next_boundary(): void
    {
        $this->journal->installProfiles();
        $this->makeTemporaryFolder('journal-skills');
        config([Place::HostSkills->rootSetting() => $this->root]);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->stack = new RecordingStack();
        $this->app->instance(AgentStacks::class, $this->stack);
        $this->app->make(SkillPublishingService::class)->refresh();

        $session = $this->startedMainAgent();
        $this->assertNotContains('user-probe', $this->latestKeys($session));

        $this->artisan(
            'skill:make',
            [
                'key' => 'user-probe',
                '--description' => 'A probe skill',
                '--body' => <<<'TEXT'
                # Probe

                Probe text.

                TEXT,
                '--ability' => [AssignmentRecipientPolicy::class.':delegate'],
            ],
        )
            ->assertSuccessful();
        $reminders = $this->boundary($session);

        $this->assertContains('user-probe', $this->latestKeys($session));
        $this->assertStringContainsString(self::NEW_SESSION, implode("\n", $reminders->all()));

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
        $this->journal->installProfiles();
        $this->makeTemporaryFolder('journal-skills');
        config([Place::HostSkills->rootSetting() => $this->root]);
        $this->app->instance(SkillTargets::class, new SkillTargets($this->root));
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(7));
        $this->stack = new RecordingStack();
        $this->app->instance(AgentStacks::class, $this->stack);
        $this->app->make(SkillPublishingService::class)->refresh();

        $session = $this->startedMainAgent();
        $this->boundary($session);
        $this->assertSame([], $this->stack->pushed);

        $this->artisan(
            'skill:make',
            ['key' => 'user-probe', '--description' => 'A probe skill', '--body' => <<<'TEXT'
            # Probe

            Probe text.

            TEXT],
        )->assertSuccessful();
        $this->boundary($session);

        $this->assertCount(1, $this->stack->pushed);
        $this->assertSame(AwaitSkillsStateReference::TYPE_KEY, $this->stack->pushed[0]->typeKey);
    }

    public function test_resume_picks_up_a_publication_a_killed_run_left_preparing(): void
    {
        $publication = $this->intend('First text.');
        $publication->claim('killed-worker', CarbonImmutable::now()->subMinute());

        $this->artisan('skill:resume')
            ->expectsOutputToContain("Publication {$publication->id}: delivered.")
            ->assertSuccessful();

        $this->assertSame(PublicationStatus::Delivered, $publication->refresh()->status);
    }

    #[TimeLimit(seconds: 3, reason: 'It starts two sessions with their accounts and writes two skill sets.')]
    public function test_two_sessions_in_one_work_folder_keep_their_own_sets_and_never_a_union(): void
    {
        $this->journal->installProfiles();
        $this->chooseActiveAccounts();

        $this->activateReviewer([]);
        $main = $this->sessionRow(Agent::create('Main', 'main-agent', $this->localProject()), 'claude-code', null);
        $reviewer = $this->sessionRow(
            Agent::create('Reviewer', 'read-only-helper', $this->localProject()),
            'claude-code',
            1,
        );

        $this->started($main);
        $this->started($reviewer);

        $mainSet = SkillPublication::findLatestOfSession($main->id);
        $reviewerSet = SkillPublication::findLatestOfSession($reviewer->id);
        $this->assertNotNull($mainSet);
        $this->assertNotNull($reviewerSet);
        $this->assertNotSame($mainSet->target, $reviewerSet->target);
        $this->assertNotSame($mainSet->selection_digest, $reviewerSet->selection_digest);
        $this->assertContains('journal-plans', $mainSet->skill_keys);
        $this->assertNotContains('journal-plans', $reviewerSet->skill_keys);
        $this->assertSame(PublicationStatus::Delivered, $mainSet->status);
        $this->assertSame(PublicationStatus::Delivered, $reviewerSet->status);
    }

    private function publishing(): SkillPublishingService
    {
        return $this->app->make(SkillPublishingService::class);
    }

    /**
     * @return list<string>
     */
    private function latestKeys(AgentSession $session): array
    {
        return SkillPublication::findLatestOfSession($session->id)?->skill_keys ?? [];
    }

    /**
     * A boundary is a hook call of its own, so it starts a new request scope with a fresh catalogue.
     */
    private function boundary(AgentSession $session): ReminderContribution
    {
        $this->app->forgetScopedInstances();
        $reminders = $this->app->make(ReminderContribution::class);
        $this->app->make(RefreshSessionSkills::class)->handle(new ContextStarted(
            new StackTarget($session->agent_id, $session->id),
            'hook-'.bin2hex(random_bytes(4)),
            ContextStartType::Resume,
            $reminders,
        ));

        return $reminders;
    }

    /**
     * @param  list<string>  $requiredSkills
     */
    private function activateReviewer(array $requiredSkills): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(
                'journal-reviewer',
                ProfileBase::readOnlyHelper(),
                'Review.',
                requiredSkills: $requiredSkills,
            ),
        )));
    }

    /**
     * Every installed domain, since the skills this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    private function sessionRow(Agent $agent, string $driver, int|null $profileRevision): AgentSession
    {
        $session = new AgentSession()->forceFill([
            ...TestSelections::sessionColumns(),
            'driver_key' => $driver,
            'profile_key' => $profileRevision === null ? 'main-agent' : 'journal-reviewer',
            'profile_revision' => $profileRevision ?? 1,
        ]);
        $session->agent_id = $agent->id;
        $session->status = SessionStatus::Active;
        $session->save();

        return $session;
    }

    private function started(AgentSession $session): void
    {
        $this->app->make(AdmitStartSkills::class)->handle(
            new SessionOpened($session->agent_id, $session->id),
        );
    }
}
