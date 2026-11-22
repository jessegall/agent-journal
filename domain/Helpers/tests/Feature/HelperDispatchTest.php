<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\CommandBus;
use App\Contracts\DriverCatalogue;
use App\Contracts\HostCapabilities;
use App\Contracts\StartReservations;
use App\Enums\CapabilityStatusType;
use App\Enums\ConversationModeType;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Enums\HostCapabilityType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agent;
use App\Models\AssignmentRecord;
use App\Models\StartRecord;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\StartReceipt;
use App\Values\ProfileBase;
use Carbon\CarbonImmutable;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
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
use Domain\Helpers\Support\Readers\HelperRecords;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Database\DatabaseManager;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent dispatches its helpers through StartHelperCommand and SendHelperCommand: a start names the resolved model, revision and
 * type; a send keeps the identity it names; busy, unfinished, retired and foreign helpers refuse with their own
 * refusal; a main or missing profile refuses before anything is written; a repeat finds the same job; a nested
 * refusal rolls everything back; and two starts never both hold one helper's reservation.
 */
#[TimeLimit(seconds: 5, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class HelperDispatchTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string SHELL_LIKE_BRIEF = 'Review it; rm -rf / && echo "$(whoami)" `id`';

    public function test_a_default_start_names_the_resolved_model_revision_and_type_and_keeps_the_brief_as_data(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7', self::SHELL_LIKE_BRIEF);
        $selection = $receipt->start->selection;

        $this->assertTrue($receipt->launch->isNewIdentity);
        $this->assertTrue($receipt->isNewJob);
        $this->assertTrue($receipt->start->newSession);
        $this->assertSame('opus', $selection->model);
        $this->assertSame(DefaultDrivers::CODEX, $selection->driver);
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
        $this->assertFalse($sent->launch->isNewIdentity);
        $this->assertSame(ConversationModeType::New, $sent->launch->conversationMode);
    }

    public function test_a_helper_starts_in_its_profile_mode_and_a_saved_mode_it_cannot_run_is_refused(): void
    {
        $first = $this->start('request-1', 'Review plan 7');
        $record = StartRecord::query()->where('request_id', $first->start->launchReference)->sole();
        $this->assertSame($this->keyOf($record->family, DriverVariant::Headless), $record->driver_key);

        Agent::query()->findOrFail($record->agent_id)->preferVariant(DriverVariant::Terminal);
        $this->finish($first);

        $this->expectException(DriverCapabilityUnsupported::class);

        $this->send('request-2', $first->identityId, 'Review plan 8');
    }

    public function test_a_helper_started_with_a_named_mode_runs_it_or_is_refused_never_swapped(): void
    {
        $this->expectException(DriverCapabilityUnsupported::class);

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            'request-1',
            'plan-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it.', [], false),
            DriverVariant::Terminal,
        ));
    }

    private function keyOf(string $family, DriverVariant $mode): string
    {
        return (string) $this->app->make(DriverCatalogue::class)->keyFor($family, $mode);
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
        $this->assertFalse($repeat->isNewJob);
        $this->assertSame(1, HelperJob::query()->count());
        $this->assertThrows(fn () => $this->start('request-1', 'Review plan 9'), HelperRequestConflict::class);
    }

    public function test_a_nested_container_refusal_rolls_back_the_purpose_identity_agent_and_job(): void
    {
        // A host whose account transport into a nested container is not proved: the evidence file has since proved
        // it for the pinned builds, so the refusal is set here rather than read from that file.
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                $status = $query->capability === HostCapabilityType::AccountTransport
                    ? CapabilityStatusType::Unverified
                    : CapabilityStatusType::Supported;

                return new HostCapability($query, $status, 'docs/x.md', 'Not proved on this host.');
            }
        });

        $agents = Agent::query()->count();

        $this->assertThrows(
            fn () => $this->app->make(DatabaseManager::class)->connection()->transaction(
                fn () => $this->start('request-1', 'Review plan 7'),
            ),
            AccountContainerUnsupported::class,
        );

        $this->assertSame(0, HelperJob::query()->count());
        $this->assertSame(0, HelperIdentity::query()->count());
        $this->assertSame($agents, Agent::query()->count());
    }

    public function test_the_parent_reads_the_same_receipt_after_a_restart_and_another_parent_cannot(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7');

        $this->parent->startRequest($this->app);
        $read = $this->app->make(HelperRecords::class)->receiptOf($receipt->jobId);

        $this->assertSame($receipt->start->launchReference, $read->start->launchReference);
        $this->assertSame($receipt->launch->conversationReason, $read->launch->conversationReason);
        $this->assertSame('opus', $read->start->selection->model);

        TestStart::start()->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->app->make(HelperRecords::class)->receiptOf($receipt->jobId),
            HelperUnavailable::class,
        );
    }

    public function test_a_second_transaction_cannot_take_a_reserved_helper_start(): void
    {
        $helper = Agent::create('Helper', 'read-only-helper');
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

    private function send(string $requestId, string $identityId, string $purpose): HelperReceipt
    {
        return $this->app->make(CommandBus::class)->run(new SendHelperCommand(
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

    private function agentOf(HelperReceipt $receipt): Agent
    {
        $identity = HelperIdentity::query()->findOrFail($receipt->identityId);

        return Agent::query()->findOrFail($identity->helper_actor_id);
    }
}
