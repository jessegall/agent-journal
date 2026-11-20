<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Contracts\StartReservations;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\StartRecord;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\StartReceipt;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\ActivateProfiles;
use App\Profiles\Values\ProfileBase;
use App\Programs\Enums\HookProgram;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Helpers\Commands\SendHelper;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Contracts\HelperReader;
use Domain\Helpers\Enums\JobState;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperJobUnfinished;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\HelperReceipt;
use Domain\Helpers\Support\HelperWork;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Database\DatabaseManager;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Profiles\TestProposals;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WithActiveAccount;

/**
 * A parent dispatches its helpers through StartHelper and SendHelper: a start names the resolved model, revision and
 * type; a send keeps the identity it names; busy, unfinished, retired and foreign helpers refuse with their own
 * refusal; a main or missing profile refuses before anything is written; a repeat finds the same job; a nested
 * refusal rolls everything back; and two starts never both hold one helper's reservation.
 */
#[TimeLimit(seconds: 5, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class HelperDispatchTest extends TestCase
{
    use RefreshHookDatabase;
    use WithActiveAccount;

    private const string SHELL_LIKE_BRIEF = 'Review it; rm -rf / && echo "$(whoami)" `id`';

    private TestStart $parent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->chooseActiveAccounts();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->app->make(CommandBus::class)->run(new ActivateProfiles(TestProposals::of(
            TestProposals::profile('plan-reviewer', ProfileBase::readOnlyHelper()),
            TestProposals::profile('journal-main', ProfileBase::mainAgent()),
        )));
        $this->parent = TestStart::start();
        $this->parent->startRequest($this->app);
        $this->supportContainers();
    }

    public function test_a_default_start_names_the_resolved_model_revision_and_type_and_keeps_the_brief_as_data(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7', self::SHELL_LIKE_BRIEF);
        $selection = $receipt->start->selection;

        $this->assertTrue($receipt->launch->identityNew);
        $this->assertTrue($receipt->jobNew);
        $this->assertTrue($receipt->start->newSession);
        $this->assertSame('opus', $selection->model);
        $this->assertSame(HookProgram::Codex, $selection->program);
        $this->assertSame(1, $receipt->launch->profileRevision);
        $this->assertSame('read-only-helper', $receipt->profileType);
        $this->assertSame(ExecutionModeType::RequiredContainer, $receipt->start->executionMode);
        $this->assertSame(ConversationModeType::New, $receipt->launch->conversationMode);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $receipt->start->actualModel);
        $this->assertSame(JobState::Accepted, $receipt->state);
        $this->assertSame(self::SHELL_LIKE_BRIEF, HelperJob::query()->findOrFail($receipt->jobId)->brief);
        $this->assertSame(1, AssignmentRecord::query()->where('record_id', $receipt->jobId)->count());
    }

    public function test_a_send_with_a_new_subject_keeps_the_named_identity_and_starts_a_new_conversation(): void
    {
        $first = $this->start('request-1', 'Review plan 7');
        $this->finish($first);

        $sent = $this->send('request-2', $first->identityId, 'Review plan 8');

        $this->assertSame($first->identityId, $sent->identityId);
        $this->assertFalse($sent->launch->identityNew);
        $this->assertSame(ConversationModeType::New, $sent->launch->conversationMode);
    }

    public function test_a_busy_unfinished_retired_or_foreign_helper_refuses_with_its_own_refusal(): void
    {
        $busy = $this->start('request-1', 'Review plan 7');
        $this->assertThrows(fn () => $this->send('request-2', $busy->identityId, 'Review plan 8'), HelperBusy::class);

        HelperJob::query()->findOrFail($busy->jobId)->markUnfinished('stop:1');
        $this->endSessionOf($busy);
        $this->assertThrows(
            fn () => $this->send('request-3', $busy->identityId, 'Review plan 8'),
            HelperJobUnfinished::class,
        );

        HelperJob::query()->findOrFail($busy->jobId)->cancel();
        $this->agentOf($busy)->retireAt(CarbonImmutable::now());
        $this->assertThrows(
            fn () => $this->send('request-4', $busy->identityId, 'Review plan 8'),
            HelperRetired::class,
        );

        $other = TestStart::start();
        $other->startRequest($this->app);
        $this->assertThrows(
            fn () => $this->send('request-5', $busy->identityId, 'Review plan 8'),
            HelperUnavailable::class,
        );
    }

    public function test_a_main_profile_or_a_missing_one_refuses_before_anything_is_written(): void
    {
        $agents = Agent::query()->count();

        $this->assertThrows(
            fn () => $this->start('request-1', 'Review plan 7', profileKey: 'journal-main'),
            HelperProfileTypeConflict::class,
        );
        $this->assertThrows(
            fn () => $this->start('request-2', 'Review plan 7', profileKey: 'missing-helper'),
            HelperProfilesUnavailable::class,
        );

        $this->assertSame(0, HelperJob::query()->count());
        $this->assertSame(0, HelperIdentity::query()->count());
        $this->assertSame($agents, Agent::query()->count());
    }

    public function test_a_helper_whose_policy_does_not_delegate_cannot_dispatch(): void
    {
        $helper = TestStart::start('read-only-helper');
        $helper->startRequest($this->app);

        $this->assertThrows(fn () => $this->start('request-1', 'Review plan 7'), HelperUnavailable::class);
        $this->assertTrue(ProfileBase::mainAgent()->defaultAccess()->contains(
            ProfileBase::readOnlyHelper()->defaultAccess(),
        ));
        $this->assertFalse(ProfileBase::readOnlyHelper()->defaultAccess()->contains(
            ProfileBase::writingHelper()->defaultAccess(),
        ));
    }

    public function test_a_repeat_finds_the_same_job_and_a_changed_repeat_conflicts(): void
    {
        $first = $this->start('request-1', 'Review plan 7');

        $repeat = $this->start('request-1', 'Review plan 7');

        $this->assertSame($first->jobId, $repeat->jobId);
        $this->assertFalse($repeat->jobNew);
        $this->assertSame(1, HelperJob::query()->count());
        $this->assertThrows(fn () => $this->start('request-1', 'Review plan 9'), HelperRequestConflict::class);
    }

    public function test_a_nested_container_refusal_rolls_back_the_purpose_identity_agent_and_job(): void
    {
        $this->app->forgetInstance(HostCapabilities::class);
        $agents = Agent::query()->count();

        $this->assertThrows(
            fn () => $this->app->make(DatabaseManager::class)->connection()->transaction(
                fn () => $this->start('request-1', 'Review plan 7'),
            ),
            ContainerUnavailable::class,
        );

        $this->assertSame(0, HelperJob::query()->count());
        $this->assertSame(0, HelperIdentity::query()->count());
        $this->assertSame($agents, Agent::query()->count());
    }

    public function test_the_parent_reads_the_same_receipt_after_a_restart_and_another_parent_cannot(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $this->parent->startRequest($this->app);
        $read = $this->app->make(HelperReader::class)->receiptOf($receipt->jobId);

        $this->assertSame($receipt->start->launchReference, $read->start->launchReference);
        $this->assertSame($receipt->launch->conversationReason, $read->launch->conversationReason);
        $this->assertSame('opus', $read->start->selection->model);

        TestStart::start()->startRequest($this->app);
        $this->assertThrows(
            fn () => $this->app->make(HelperReader::class)->receiptOf($receipt->jobId),
            HelperUnavailable::class,
        );
    }

    public function test_a_second_transaction_cannot_take_a_reserved_helper_start(): void
    {
        $helper = Agent::named('Helper', 'read-only-helper');
        $databases = $this->app->make(DatabaseManager::class);
        $default = (string) config('database.default');
        config(['database.connections.competing' => config(sprintf('database.connections.%s', $default))]);
        $competing = $databases->connection('competing');

        $databases->connection()->transaction(function () use ($helper, $competing) {
            $this->app->make(StartReservations::class)->reserve(ActorIdentity::of($helper));

            $taken = $competing->transaction(fn () => $competing->selectOne(
                'select pg_try_advisory_xact_lock(?, hashtext(?)) as taken',
                [7_304_211, $helper->id],
            ));

            $this->assertFalse($taken->taken);
        });

        $databases->purge('competing');
    }

    private function start(
        string $requestId,
        string $purpose,
        string $brief = 'Review it.',
        string $profileKey = 'plan-reviewer',
    ): HelperReceipt {
        return $this->app->make(CommandBus::class)->run(new StartHelper(
            $requestId,
            $profileKey,
            'default',
            null,
            new HelperWork(null, null, $purpose, $brief, [], false),
        ));
    }

    private function send(string $requestId, string $identityId, string $purpose): HelperReceipt
    {
        return $this->app->make(CommandBus::class)->run(new SendHelper(
            $requestId,
            $identityId,
            'plan-reviewer',
            'default',
            null,
            new HelperWork(null, null, $purpose, 'Review it.', [], false),
        ));
    }

    private function finish(HelperReceipt $receipt): void
    {
        HelperJob::query()->findOrFail($receipt->jobId)->finish('report:1');
        $this->endSessionOf($receipt);
    }

    private function endSessionOf(HelperReceipt $receipt): void
    {
        $sessionId = StartRecord::query()->where('request_id', $receipt->start->launchReference)->sole()->session_id;
        AgentSession::query()->findOrFail($sessionId)->endAt(CarbonImmutable::now());
    }

    private function agentOf(HelperReceipt $receipt): Agent
    {
        $identity = HelperIdentity::query()->findOrFail($receipt->identityId);

        return Agent::query()->findOrFail($identity->helper_actor_id);
    }

    private function supportContainers(): void
    {
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(HelperImages::class, new class implements HelperImages
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(8, 64 * 1024 ** 3, 500 * 1024 ** 3));
    }
}
