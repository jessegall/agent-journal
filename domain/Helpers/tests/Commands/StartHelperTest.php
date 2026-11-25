<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Hosts\HostCapabilities;
use App\Contracts\Sessions\StartReservations;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\CapabilityStatusType;
use App\Enums\Projects\HostCapabilityType;
use App\Exceptions\AccountContainerUnsupported;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\HostCapability;
use App\Support\HostCapabilityQuery;
use App\Support\StartReceipt;
use App\Values\ProfileBase;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Support\Readers\HelperRecords;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Database\DatabaseManager;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent starts a helper: the start names the resolved model, revision and type and runs in its profile's mode or
 * is refused, never swapped; a main or missing profile and a policy that does not delegate refuse before anything is
 * written; a repeat finds the same job, a nested refusal rolls everything back, and two starts never both hold one
 * helper's reservation.
 */
#[TimeLimit(seconds: 5, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class StartHelperTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string SHELL_LIKE_BRIEF = 'Review it; rm -rf / && echo "$(whoami)" `id`';

    public function test_a_default_start_names_the_resolved_model_revision_and_type_and_keeps_the_brief_as_data(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7', self::SHELL_LIKE_BRIEF);
        $selection = $receipt->start->selection;

        $this->assertTrue($receipt->startDetails->isNewIdentity);
        $this->assertTrue($receipt->isNewJob);
        $this->assertTrue($receipt->start->isNewSession);
        $this->assertSame('gpt-6.2-sol', $selection->model);
        $this->assertSame(DefaultDrivers::CODEX, $selection->driver);
        $this->assertSame(1, $receipt->startDetails->profileRevision);
        $this->assertSame('read-only-helper', $receipt->profileType);
        $this->assertSame(ExecutionModeType::RequiredContainer, $receipt->start->executionMode);
        $this->assertSame(ConversationModeType::New, $receipt->startDetails->conversationMode);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $receipt->start->actualModel);
        $this->assertSame(JobStatus::Accepted, $receipt->state);
        $this->assertSame(self::SHELL_LIKE_BRIEF, HelperJob::query()->findOrFail($receipt->jobId)->brief);
        $this->assertSame(1, AssignmentRecord::query()->where('record_id', $receipt->jobId)->count());
    }

    public function test_a_helper_starts_in_its_profile_mode_and_a_saved_mode_it_cannot_run_is_refused(): void
    {
        $first = $this->start('request-1', 'Review plan 7');
        $record = SessionRequest::query()->where('request_id', $first->start->startReference)->sole();
        $this->assertSame($this->keyOf($record->family, DriverType::Headless), $record->driver_key);

        Agent::query()->findOrFail($record->agent_id)->preferDriverType(DriverType::Terminal);
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
            DriverType::Terminal,
        ));
    }

    private function keyOf(string $family, DriverType $mode): string
    {
        return (string) $this->app->make(DriverCatalogue::class)->keyFor($family, $mode);
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
        $helper = $this->journal->signedStart('Test agent', 'read-only-helper');
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

        $this->assertSame($receipt->start->startReference, $read->start->startReference);
        $this->assertSame($receipt->startDetails->conversationReason, $read->startDetails->conversationReason);
        $this->assertSame('gpt-6.2-sol', $read->start->selection->model);

        $this->journal->signedStart('Test agent 2')->startRequest($this->app);

        $this->assertThrows(
            fn () => $this->app->make(HelperRecords::class)->receiptOf($receipt->jobId),
            HelperUnavailable::class,
        );
    }

    public function test_a_second_transaction_cannot_take_a_reserved_helper_start(): void
    {
        $helper = $this->journal->idleAgent('Helper', 'read-only-helper')->agentCalled('Helper');
        $databases = $this->app->make(DatabaseManager::class);
        $default = (string) config('database.default');
        config(['database.connections.competing' => config(sprintf('database.connections.%s', $default))]);
        $competing = $databases->connection('competing');

        $databases->connection()->transaction(function () use ($helper, $competing) {
            $this->app->make(StartReservations::class)->reserve(ActorIdentity::of($helper));

            $taken = $competing->transaction(fn () => $competing->selectOne(
                'select pg_try_advisory_xact_lock(?, hashtext(?)) as taken',
                [
                    7_304_211,
                    $helper->id,
                ],
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
}
