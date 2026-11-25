<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Console\Commands\ProfileActivateCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\AccessType;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Asks\SupervisorCoverageType;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Profiles\PolicyOriginType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\ActorNotAllowed;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\GrantNotWithheld;
use App\Exceptions\SupervisorRouteInvalid;
use App\Exceptions\SupervisorRouteRefused;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\AgentImage;
use App\Support\ArrangementSetting;
use App\Support\DefaultDrivers;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Support\RecordIdentity;
use App\Values\ActivatedProfile;
use App\Values\AskTypeKey;
use App\Values\DraftExpectations;
use App\Values\ExecutionBudgets;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ProfileSnapshot;
use App\Values\ProfileStartPolicy;
use App\Values\ScriptSource;
use App\Values\StartPolicy;
use App\Values\StartProfileAuthority;
use App\Values\StartRequest;
use App\Values\StopCondition;
use App\Values\WithheldGrant;
use Domain\Rules\Commands\ProposeRule\ProposeRuleCommand;
use Domain\Rules\Policies\RulePolicy;
use Domain\Rules\RulesDomain;
use Illuminate\Support\Facades\DB;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner activates profiles: each activation is kept with the actor that sent it as its author, and a second
 * activation adds the next revision while the first stays readable.
 */
#[TestsCommand(ActivateProfilesCommand::class)]
final class ActivateProfilesTest extends TestCase
{
    use CommitsHookRows;
    use HasContainerSupport;
    use WithActiveAccount;

    private const string REVIEW_TWICE = 'Review the change twice.';

    private const string REVIEW_ONCE = 'Review the change.';

    private const array TABLES = [
        'profile_revisions',
        'profiles',
        'command_receipts',
        'profile_draft_revisions',
        'profile_drafts',
    ];

    private const string PROFILE = 'container-writer';

    private const array ROUTE_PROFILE = ['base' => 'writing-helper', 'tier' => 2];

    private const string ROUTE_CYCLE = 'The question supervisor route has a cycle:';

    private const string DESCRIPTION = 'Reads every change and says what is wrong with it.';

    private User $owner;

    private const string WRITER = 'journal-writer';

    private const string EXECUTOR = 'journal-executor';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(7));
    }

    public function test_a_second_activation_appends_revision_2_and_keeps_revision_1_readable(): void
    {
        $first = $this->activate($this->reviewer('Review the change.', null));
        $second = $this->activate($this->reviewer('Review the change twice.', []));

        $this->assertSame(1, $first->profiles[0]->revision);
        $this->assertSame(2, $second->profiles[0]->revision);
        $this->assertSame(1, Profile::query()->count());

        $snapshot = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('journal-reviewer'));
        $this->assertSame(2, $snapshot->revision);
        $this->assertSame(self::REVIEW_TWICE, $snapshot->instructions);
        $this->assertSame([], $snapshot->skillAllowlist);
        $this->assertSame(ProfileBase::readOnlyHelper()->key, $snapshot->base->key);

        $profile = Profile::findByKey(ProfileKey::from('journal-reviewer'));
        $this->assertSame(self::REVIEW_ONCE, ProfileRevision::findNumbered($profile, 1)->instructions);
        $this->assertNull(ProfileRevision::findNumbered($profile, 1)->skill_allowlist);
    }

    public function test_an_activation_records_the_dispatching_actor_as_author(): void
    {
        $this->activate($this->reviewer('Review the change.', null));

        $revision = ProfileRevision::findNumbered(Profile::findByKey(ProfileKey::from('journal-reviewer')), 1);
        $this->assertSame([User::storedType(), TestIds::of(7)], [$revision->author_type, $revision->author_id]);
    }

    public function test_activation_refuses_an_unproven_concrete_combination_before_publishing_the_profile(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $commands = $this->app->make(CommandBus::class);
        $this->recordCapabilities(CapabilityStatusType::Supported, CapabilityStatusType::Unverified);

        $this->assertThrows(fn () => $commands->run($this->activation()), AccountContainerUnsupported::class);
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from(self::PROFILE)));

        $this->recordCapabilities(CapabilityStatusType::Unverified);
        $this->assertThrows(fn () => $commands->run($this->activation()), ContainerUnavailable::class);
        $this->assertFalse($this->app->make(ProfileResolver::class)->has(ProfileKey::from(self::PROFILE)));
    }

    public function test_a_proven_writer_combination_is_admitted_and_withdrawn_evidence_blocks_the_next_start(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->actAsUserId(TestIds::of(1));
        $this->recordCapabilities(CapabilityStatusType::Supported);
        $this->mock(DockerImageVerifier::class)->shouldReceive('isVerified')->andReturn(true);
        $commands = $this->app->make(CommandBus::class);
        $commands->run($this->activation());
        $profile = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from(self::PROFILE));
        $policy = $profile->start->freeze((string) $profile->key, $profile->revision);
        $first = $commands->run($this->start($policy));
        $this->assertTrue($first->isNewSession);

        $this->recordCapabilities(CapabilityStatusType::Supported, CapabilityStatusType::Unverified);
        $this->assertThrows(fn () => $commands->run($this->start($policy)), AccountContainerUnsupported::class);
    }

    public function test_with_no_owner_yet_activation_says_why_it_waits_and_succeeds(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));
        $this->emptyTables('profile_revisions', 'profiles');

        $this->artisan('profile:activate')
            ->expectsOutput(ProfileActivateCommand::NO_OWNER_YET)
            ->assertSuccessful();

        $this->assertSame(0, Profile::query()->count());
    }

    public function test_activation_freezes_the_source_graph_and_used_definition_digest(): void
    {
        $this->journal->actAsUserId(TestIds::of(1));
        $commands = $this->app->make(CommandBus::class);
        $profile = ProfileKey::from('scripted-review');
        $source = new ScriptSource("ON STOP\nYIELD \"Check again.\"\nEND");
        $commands->run(new SaveProfileDraftCommand($profile, 0, $source));
        $proposal = ProfileProposal::fromConfiguration(['profiles' => [
            $profile->key => ['base' => 'read-only-helper', 'tier' => 3],
        ]]);
        $commands->run(new ActivateProfilesCommand($proposal, DraftExpectations::fromOptions([$profile->key.'=1'])));

        $revision = ProfileRevision::findCurrentOf(Profile::findByKey($profile));
        $this->assertSame($source->toArray(), $revision->script_source->toArray());
        $script = $revision->script;
        $this->assertSame('line-2', $script->compiled->handlers['STOP']->entry);
        $this->assertSame(['STOP'], array_keys($script->compiled->handlers));
        $this->assertMatchesRegularExpression('/^[0-9a-f]{64}$/D', $script->compiled->definitionDigest);
    }

    public function test_shipped_routes_are_stored_and_their_supervisors_admit_every_required_command(): void
    {
        $activation = $this->activateConfiguration((array) config('profiles'));
        $profiles = $this->app->make(ProfileResolver::class);
        $reviewer = $profiles->snapshotFor(ProfileKey::from('journal-code-reviewer'));
        $worker = $profiles->snapshotFor(ProfileKey::from('journal-worker'));

        $this->assertSame('profile:journal-code-reviewer', $worker->supervisor->default->key);
        $this->assertSame('profile:journal-main', $reviewer->supervisor->targetFor(AskTypeKey::of('question'))->key);

        $byKey = collect($activation->profiles)->keyBy(fn (ActivatedProfile $profile) => $profile->key->key);
        $coverage = $byKey['journal-worker']->supervisorCoverage;
        $this->assertNotContains(SupervisorCoverageType::Unsupported, array_column($coverage, 'status'));
    }

    public function test_mixed_type_routes_are_valid_but_a_reachable_cycle_saves_nothing(): void
    {
        $routes = [
            'route-a' => [
                ...self::ROUTE_PROFILE,
                'supervisor' => ['default' => 'owner', 'question' => 'profile:route-b'],
            ],
            'route-b' => [...self::ROUTE_PROFILE, 'supervisor' => ['default' => 'owner', 'stuck' => 'profile:route-a']],
        ];
        $this->activateConfiguration(['profiles' => $routes]);
        $routes['route-b']['supervisor']['question'] = 'profile:route-a';

        $this->assertThrows(
            fn () => $this->activateConfiguration(['profiles' => $routes]),
            SupervisorRouteRefused::class,
            self::ROUTE_CYCLE,
        );

        $saved = $this->app->make(ProfileResolver::class)->snapshotFor(ProfileKey::from('route-b'));
        $this->assertSame(1, $saved->revision);
        $this->assertSame('owner', $saved->supervisor->targetFor(AskTypeKey::of('question'))->key);
        $this->assertSame('profile:route-a', $saved->supervisor->targetFor(AskTypeKey::of('stuck'))->key);
    }

    public function test_unknown_targets_and_missing_defaults_are_refused(): void
    {
        foreach ([
            ['question' => 'owner'],
            ['default' => null],
            ['default' => 'profile:missing'],
            ['default' => 'owner', 'unknown' => 'owner'],
        ] as $supervisor) {
            $this->assertThrows(
                fn () => $this->activateConfiguration(
                    ['profiles' => ['route-a' => [...self::ROUTE_PROFILE, 'supervisor' => $supervisor]]],
                ),
                SupervisorRouteInvalid::class,
            );
        }
    }

    public function test_a_proposed_description_reaches_the_row_and_a_profile_without_one_keeps_it_empty(): void
    {
        $this->activateDescribedReviewer();

        $this->assertSame(self::DESCRIPTION, Profile::findByKey(ProfileKey::from('reviewer'))->description);
        $this->assertSame('', Profile::findByKey(ProfileKey::from('worker'))->description);
    }

    public function test_a_session_of_a_narrowed_profile_is_refused_what_it_withholds_and_the_full_one_is_not(): void
    {
        $this->journal->owner();

        $this->activateWithheld([new WithheldGrant(RulePolicy::class, AccessType::Create)]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);

        $this->actUnder(self::WRITER, 1);
        $this->propose();
        $this->assertFalse($this->snapshot(self::EXECUTOR, 1)->authorization->grants(
            RulePolicy::class,
            AccessType::Create,
        ));
    }

    public function test_withholding_an_ability_the_base_does_not_grant_is_refused(): void
    {
        $this->journal->owner();

        $this->assertThrows(
            fn () => $this->activateWithheld([new WithheldGrant(RulePolicy::class, AccessType::Edit)]),
            GrantNotWithheld::class,
        );
    }

    public function test_a_later_activation_leaves_a_running_sessions_grants_as_they_were(): void
    {
        $this->journal->owner();

        $this->activateWithheld([new WithheldGrant(RulePolicy::class, AccessType::Create)]);

        $this->activateWithheld([]);

        $this->actUnder(self::EXECUTOR, 1);
        $this->assertThrows(fn () => $this->propose(), ActorNotAllowed::class);
        $this->actUnder(self::EXECUTOR, 2);
        $this->propose();
    }

    public function test_a_reader_profile_is_a_read_only_helper(): void
    {
        $activation = $this->activateProfile('journal-reviewer', ProfileBase::readOnlyHelper());

        $snapshot = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame(ProfileBase::readOnlyHelper()->key, $snapshot->base->key);
        $start = $snapshot->start;
        $this->assertSame(DefaultDrivers::CODEX, $start->preferredDriver);
        $this->assertSame([], $start->stopConditions->conditions);
        $this->assertSame(ExecutionModeType::RequiredContainer, $start->execution->mode);
        $this->assertSame($activation->configurationHash, $start->provenance->configurationHash);
        $this->assertSame(PolicyOriginType::GlobalDefault, $start->provenance->originOf('access'));
    }

    public function test_a_writer_profile_keeps_clean_worktree_and_the_required_container(): void
    {
        $this->activateProfile('journal-worker', ProfileBase::writingHelper());

        $snapshot = $this->resolver()->snapshotFor(ProfileKey::from('journal-worker'));

        $start = $snapshot->start;
        $this->assertSame(ProfileBase::writingHelper()->key, $snapshot->base->key);
        $this->assertSame(
            [StopCondition::CLEAN_WORKTREE],
            array_map(fn (StopCondition $condition) => $condition->key, $start->stopConditions->conditions),
        );
        $this->assertSame(ExecutionModeType::RequiredContainer, $start->execution->mode);
        $this->assertSame(ProfileStartPolicy::HELPER_IMAGE, $start->execution->imageReference);
    }

    public function test_on_a_server_every_session_runs_in_the_agent_image_and_the_main_agent_gets_its_larger_budget(): void
    {
        $image = 'journal-agent@sha256:'.str_repeat('a', 64);
        $this->app->instance(ArrangementSetting::class, ArrangementSetting::fromConfig('contained', 'acme', '{}'));
        $this->app->instance(AgentImage::class, AgentImage::fromConfig($image));
        $this->activateProfile('journal-main', ProfileBase::mainAgent());
        $this->activateProfile('journal-reviewer', ProfileBase::readOnlyHelper());

        $main = $this->resolver()->snapshotFor(ProfileKey::from('journal-main'))->start->execution;
        $helper = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'))->start->execution;

        $this->assertSame([ExecutionModeType::RequiredContainer, $image], [$main->mode, $main->imageReference]);
        $this->assertSame(1024 * 1024 * 1024, $main->budgets->tmpBytes);
        $this->assertSame([ExecutionModeType::RequiredContainer, $image], [$helper->mode, $helper->imageReference]);
        $this->assertEquals(ExecutionBudgets::defaults(), $helper->budgets);
    }

    public function test_the_main_agent_defaults_to_a_terminal_and_each_helper_to_headless(): void
    {
        $this->activateProfile('journal-main', ProfileBase::mainAgent());
        $this->activateProfile('journal-reviewer', ProfileBase::readOnlyHelper());
        $this->activateProfile('journal-worker', ProfileBase::writingHelper());

        $driverTypes = array_map(
            fn (string $key) => $this->resolver()->snapshotFor(ProfileKey::from($key))->base->defaultDriverType,
            ['journal-main', 'journal-reviewer', 'journal-worker'],
        );

        $this->assertSame([DriverType::Terminal, DriverType::Headless, DriverType::Headless], $driverTypes);
    }

    public function test_locally_the_main_agent_stays_on_the_protected_host_with_the_default_budget(): void
    {
        $this->activateProfile('journal-main', ProfileBase::mainAgent());

        $main = $this->resolver()->snapshotFor(ProfileKey::from('journal-main'))->start->execution;

        $this->assertSame([ExecutionModeType::ProtectedHost, null], [$main->mode, $main->imageReference]);
        $this->assertEquals(ExecutionBudgets::defaults(), $main->budgets);
    }

    public function test_the_proposal_file_changes_nothing_the_reader_answers(): void
    {
        $this->activateProfile('journal-reviewer', ProfileBase::readOnlyHelper());
        $before = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $proposal = ['profiles' => ['journal-reviewer' => ['base' => 'writing-helper']]];
        $this->app->make('config')->set('profiles', $proposal);

        $after = $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));

        $this->assertSame($before->base->key, $after->base->key);
        $this->assertEquals($before->start->provenance, $after->start->provenance);
        $this->artisan('profile:show', ['key' => 'journal-reviewer'])
            ->expectsOutputToContain('Starts from: Read-only helper')
            ->assertSuccessful();
    }

    public function test_a_damaged_start_policy_column_fails_the_read(): void
    {
        $this->activateProfile('journal-reviewer', ProfileBase::readOnlyHelper());
        DB::table('profile_revisions')->update(['start_policy' => '{"class_grants": 3}']);

        $this->expectException(CannotCreateData::class);

        $this->resolver()->snapshotFor(ProfileKey::from('journal-reviewer'));
    }

    /**
     * @param  list<string>|null  $allowlist
     */
    private function reviewer(string $instructions, array|null $allowlist): ProposedProfile
    {
        return TestProposals::profile(
            'journal-reviewer',
            ProfileBase::readOnlyHelper(),
            $instructions,
            ModelTier::Inventive,
            $allowlist,
        );
    }

    private function activate(ProposedProfile $profile): ProfileActivation
    {
        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of($profile)));
    }

    /**
     * Records the container runtime and the account transport as given, and every other capability supported.
     */
    private function recordCapabilities(
        CapabilityStatusType $runtime,
        CapabilityStatusType $account = CapabilityStatusType::Supported,
    ): void {
        $this->mock(HostCapabilities::class)->shouldReceive('capability')->andReturnUsing(
            function (HostCapabilityQuery $query) use ($runtime, $account): HostCapability {
                $status = match ($query->capability) {
                    HostCapabilityType::ContainerRuntime => $runtime,
                    HostCapabilityType::AccountTransport => $account,
                    default => CapabilityStatusType::Supported,
                };

                return new HostCapability($query, $status, 'Test evidence', 'Recorded for the test.');
            },
        );
    }

    private function start(StartPolicy $policy): StartAgentCommand
    {
        $actor = Agent::create('Editor', self::PROFILE, $this->localProject());

        return new StartAgentCommand(new StartRequest(
            TestSelections::requestId(),
            $actor->id,
            TestSelections::of(),
            StartOriginType::OwnerRequest,
            new RecordIdentity('tests.owner', '01m7wgahp0n7766x1e1ta8ehew'),
            null,
            ConversationModeType::New,
            null,
            $policy,
            driverType: DriverType::Headless,
        ));
    }

    private function activation(): ActivateProfilesCommand
    {
        return new ActivateProfilesCommand(ProfileProposal::fromConfiguration(['profiles' => [
            self::PROFILE => ['base' => 'writing-helper', 'tier' => 3, 'preferred_driver' => 'claude-code'],
        ]]));
    }

    /**
     * @param  array<string, mixed>  $configuration
     */
    private function activateConfiguration(array $configuration): ProfileActivation
    {
        $this->journal->actAsUserId(TestIds::of(1));

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(
            ProfileProposal::fromConfiguration(['revision' => 1, ...$configuration]),
        ));
    }

    private function activateDescribedReviewer(): void
    {
        $this->journal->actAsUserId(TestIds::of(7));
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(ProfileProposal::fromConfiguration([
            'revision' => 1,
            'base_overrides' => [],
            'profiles' => [
                'reviewer' => [
                    'base' => 'read-only-helper',
                    'tier' => 2,
                    'description' => self::DESCRIPTION,
                    'supervisor' => ['default' => 'owner'],
                ],
                'worker' => [
                    'base' => 'writing-helper',
                    'tier' => 2,
                    'supervisor' => ['default' => 'owner'],
                ],
            ],
        ])));
    }

    private function propose(): void
    {
        $this->app->make(CommandBus::class)->run(
            new ProposeRuleCommand('Write tests first.', 'It keeps the work honest.'),
        );
    }

    private function snapshot(string $profileKey, int $revision): ProfileSnapshot
    {
        return $this->app->make(ProfileResolver::class)->snapshotAt(ProfileKey::from($profileKey), $revision);
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    /**
     * @param  list<WithheldGrant>  $withheld
     */
    private function activateWithheld(array $withheld): void
    {
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand(TestProposals::of(
            TestProposals::profile(self::EXECUTOR, ProfileBase::writingHelper(), withheldGrants: $withheld),
            TestProposals::profile(self::WRITER, ProfileBase::writingHelper()),
        )));
    }

    private function actUnder(string $profileKey, int $revision): void
    {
        $agent = Agent::create('Helper', $profileKey, $this->localProject());
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($agent->id),
            new StartProfileAuthority($this->snapshot($profileKey, $revision)),
        );
    }

    private function resolver(): ProfileResolver
    {
        return $this->app->make(ProfileResolver::class);
    }

    private function activateProfile(string $key, ProfileBase $type): ProfileActivation
    {
        $proposal = TestProposals::of(TestProposals::profile($key, $type));

        return $this->app->make(CommandBus::class)->run(new ActivateProfilesCommand($proposal));
    }
}
