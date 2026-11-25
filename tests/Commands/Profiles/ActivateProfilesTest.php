<?php

declare(strict_types=1);

namespace Tests\Commands\Profiles;

use App\Commands\Agents\StartAgent\StartAgentCommand;
use App\Commands\Profiles\ActivateProfiles\ActivateProfilesCommand;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Console\Commands\ProfileActivateCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\DockerImageVerifier;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\ProfileResolver;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Asks\SupervisorCoverageType;
use App\Enums\Drivers\DriverType;
use App\Enums\Profiles\ModelTier;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Enums\Sessions\StartOriginType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\ContainerUnavailable;
use App\Exceptions\SupervisorRouteInvalid;
use App\Exceptions\SupervisorRouteRefused;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Profiles\Profile;
use App\Models\Profiles\ProfileRevision;
use App\Support\Access\AccessSettings;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\ProfileProposal;
use App\Support\ProposedProfile;
use App\Support\RecordIdentity;
use App\Values\ActivatedProfile;
use App\Values\AskTypeKey;
use App\Values\DraftExpectations;
use App\Values\ProfileActivation;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use App\Values\ScriptSource;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\Agents\HasContainerSupport;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The owner activates profiles: each activation is kept with the actor that sent it as its author, and a second
 * activation adds the next revision while the first stays readable.
 */
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
            'route-a' => [...self::ROUTE_PROFILE, 'supervisor' => ['default' => 'owner', 'question' => 'profile:route-b']],
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
}
