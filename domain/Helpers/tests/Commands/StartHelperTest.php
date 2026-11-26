<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Commands;

use App\Agents\Commands\RetireAgent\RetireAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Bus\Contracts\CommandBus;
use App\Events\Hooks\HelperAssigned;
use App\Exceptions\CrossProjectEdge;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Hosts\Contracts\HostCapabilities;
use App\Hosts\HostCapability;
use App\Hosts\HostCapabilityQuery;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Models\Sessions\SessionRequest;
use App\Projects\Enums\CapabilityStatusType;
use App\Projects\Enums\HostCapabilityType;
use App\Projects\Exceptions\AccountContainerUnsupported;
use App\Records\Contracts\RecordVisibility;
use App\Sessions\Contracts\StartReservations;
use App\Sessions\StartReceipt;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\ProfileBase;
use Domain\Helpers\Commands\CancelHelperJob\CancelHelperJobCommand;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Exceptions\HelperBusy;
use Domain\Helpers\Exceptions\HelperProfilesUnavailable;
use Domain\Helpers\Exceptions\HelperProfileTypeConflict;
use Domain\Helpers\Exceptions\HelperRequestConflict;
use Domain\Helpers\Exceptions\HelperRetired;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\HelpersDomain;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\Readers\HelperRecords;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\HelperReceipt;
use Domain\Helpers\Values\HelperWork;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\DatabaseManager;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestProjects;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A parent starts a helper: the start names the resolved model, revision and type and runs in its profile's mode or
 * is refused, never swapped; a main or missing profile and a policy that does not delegate refuse before anything is
 * written; a repeat finds the same job, a nested refusal rolls everything back, and two starts never both hold one
 * helper's reservation.
 */
#[TestsCommand(StartHelperCommand::class)]
#[TimeLimit(seconds: 5, reason: 'It activates profiles and starts agent sessions for several dispatches.')]
final class StartHelperTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    private const string SHELL_LIKE_BRIEF = 'Review it; rm -rf / && echo "$(whoami)" `id`';

    /**
     * A task of another project is the source the cross-project refusal is checked with, so Tasks boots beside Helpers.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(HelpersDomain::class, TasksDomain::class);
    }

    public function test_a_default_start_names_the_resolved_model_revision_and_type_and_keeps_the_brief_as_data(): void
    {
        $receipt = $this->start('request-1', 'Review plan 7', self::SHELL_LIKE_BRIEF);
        $selection = $receipt->start->selection;

        $this->assertTrue($receipt->startDetails->isNewIdentity);
        $this->assertTrue($receipt->isNewJob);
        $this->assertTrue($receipt->start->isNewSession);
        $this->assertSame('opus', $selection->model);
        $this->assertSame(DefaultDrivers::CLAUDE_CODE, $selection->driver);
        $this->assertSame(1, $receipt->startDetails->profileRevision);
        $this->assertSame('read-only-helper', $receipt->profileType);
        $this->assertSame(ExecutionModeType::RequiredContainer, $receipt->start->executionMode);
        $this->assertSame(ConversationModeType::New, $receipt->startDetails->conversationMode);
        $this->assertSame(StartReceipt::ACTUAL_MODEL_NOT_REPORTED, $receipt->start->actualModel);
        $this->assertSame(JobStatus::Accepted, $receipt->status);
        $this->assertSame(self::SHELL_LIKE_BRIEF, HelperJob::query()->findOrFail($receipt->jobId)->brief);
        $this->assertSame(1, AssignmentRecord::query()->where('record_id', $receipt->jobId)->count());
    }

    public function test_a_helper_starts_in_its_profile_mode_and_a_send_runs_the_mode_saved_on_its_agent(): void
    {
        $first = $this->start('request-1', 'Review plan 7');
        $record = SessionRequest::query()->where('request_id', $first->start->startReference)->sole();
        $this->assertSame($this->keyOf($record->family, DriverType::Headless), $record->driver_key);

        Agent::query()->findOrFail($record->agent_id)->preferDriverType(DriverType::Terminal);
        $this->finish($first);
        $second = $this->send('request-2', $first->identityId, 'Review plan 8');
        $sent = SessionRequest::query()->where('request_id', $second->start->startReference)->sole();

        $this->assertSame($this->keyOf($record->family, DriverType::Terminal), $sent->driver_key);
    }

    public function test_a_helper_started_with_a_mode_its_driver_cannot_run_contained_is_refused_never_swapped(): void
    {
        $this->expectException(DriverCapabilityUnsupported::class);

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            'request-1',
            'codex-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it.', [], false),
            TestProjects::local()->id,
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
        $this->assertSame('opus', $read->start->selection->model);

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
            $this->app->make(StartReservations::class)->reserve(ActorReference::of($helper));

            $taken = $competing->transaction(fn () => $competing->selectOne(
                'select pg_try_advisory_xact_lock(?, hashtext(?)) as taken',
                [7_304_211, $helper->id],
            ));

            $this->assertFalse($taken->taken);
        });

        $databases->purge('competing');
    }

    public function test_a_start_without_a_model_is_refused_before_any_call(): void
    {
        $this->journal->relayAgentCommands($this->parent);

        $this->artisan('helper:start', ['profile' => 'plan-reviewer', '--brief' => 'Review it.'])
            ->expectsOutputToContain('model-required')
            ->assertFailed();

        $this->assertSame(0, HelperJob::query()->acrossActors()->count());
    }

    public function test_a_start_prints_the_identity_job_conversation_and_models(): void
    {
        $this->journal->relayAgentCommands($this->parent);

        $this->artisan('helper:start', [
            'profile' => 'plan-reviewer',
            '--model' => 'default',
            '--purpose-text' => 'Review plan 7',
            '--brief' => 'Review it.',
        ])
            ->expectsOutputToContain('Conversation new')
            ->expectsOutputToContain('actual: '.StartReceipt::ACTUAL_MODEL_NOT_REPORTED)
            ->assertSuccessful();

        $this->assertSame(JobStatus::Running, HelperJob::query()->acrossActors()->sole()->status);
    }

    public function test_a_helper_started_on_a_plan_is_announced_with_its_agent(): void
    {
        $plan = new RecordIdentity('plans.plan', (string) Str::ulid());

        $this->app->instance(RecordVisibility::class, new class implements RecordVisibility
        {
            public function isVisible(RecordIdentity $record): bool
            {
                return true;
            }
        });

        $heard = [];

        Event::listen(HelperAssigned::class, function (HelperAssigned $event) use (&$heard): void {
            $heard[] = $event;
        });

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            'request-plan',
            'plan-reviewer',
            'default',
            null,
            new HelperWork($plan, null, null, 'Review it.', [], false),
            TestProjects::local()->id,
        ));

        $identity = HelperIdentity::query()->findOrFail(HelperJob::query()->sole()->helper_identity_id);
        $this->assertCount(1, $heard);
        $this->assertEquals($plan, $heard[0]->subject);
        $this->assertSame($identity->helperActor->id, $heard[0]->helperAgentId);
    }

    public function test_a_single_profile_binds_its_one_helper_and_never_makes_a_second(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->cancelAndEnd($first);
        $second = $this->start((string) Str::ulid(), 'Review plan 8', profileKey: 'lone-reviewer');

        $this->assertSame($first->identityId, $second->identityId);
        $this->expectException(HelperBusy::class);

        $this->start((string) Str::ulid(), 'Review plan 9', profileKey: 'lone-reviewer');
    }

    public function test_a_retired_single_helper_is_replaced_once_its_process_ended(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->cancelAndEnd($first);
        $this->retireHelperOf($first);

        $second = $this->start((string) Str::ulid(), 'Review plan 8', profileKey: 'lone-reviewer');

        $this->assertNotSame($first->identityId, $second->identityId);
        $designated = HelperIdentity::findDesignatedFor(TestProjects::local()->id, 'lone-reviewer');
        $this->assertSame($second->identityId, $designated->get()->id);
    }

    public function test_an_agents_helper_its_purpose_and_its_job_belong_to_the_agents_project(): void
    {
        $projectId = $this->startAsAgentOf('A');

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            (string) Str::ulid(),
            'plan-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it.', [], false),
            $projectId,
        ));

        $job = HelperJob::query()->acrossActors()->sole();
        $identity = HelperIdentity::query()->acrossActors()->findOrFail($job->helper_identity_id);
        $purpose = HelperPurpose::query()->acrossActors()->findOrFail($job->helper_purpose_id);

        $this->assertSame(
            array_fill(0, 4, $projectId),
            [
                $job->project_id,
                $identity->project_id,
                $purpose->project_id,
                Agent::findProjectIdOf($identity->helper_actor_id),
            ],
        );
    }

    public function test_a_single_profile_keeps_one_designated_helper_in_each_project_without_a_clash(): void
    {
        $local = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $projectId = $this->startAsAgentOf('B');

        $inB = $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            (string) Str::ulid(),
            'lone-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it.', [], false),
            $projectId,
        ));

        $this->assertNotSame($local->identityId, $inB->identityId);
        $this->assertSame($inB->identityId, HelperIdentity::findDesignatedFor($projectId, 'lone-reviewer')->get()->id);
    }

    public function test_a_source_of_another_project_is_refused_and_nothing_is_written(): void
    {
        $this->journal->project('B');
        $task = Task::factory()->create(['project_id' => $this->journal->projectCalled('B')->id]);
        $this->journal->actAs('Owner');
        $this->supportContainers();

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new StartHelperCommand(
                (string) Str::ulid(),
                'plan-reviewer',
                'default',
                null,
                new HelperWork(null, null, 'Review it', 'Review it.', [Task::linkType().':'.$task->id], false),
                TestProjects::local()->id,
            )),
            CrossProjectEdge::class,
        );

        $this->assertSame(0, HelperJob::query()->acrossActors()->count());
    }

    public function test_the_single_helper_cannot_review_a_purpose_it_worked_on_independently(): void
    {
        $first = $this->start((string) Str::ulid(), 'Review plan 7', profileKey: 'lone-reviewer');
        $this->cancelAndEnd($first);
        $this->expectException(HelperUnavailable::class);

        $this->app->make(CommandBus::class)->run(new StartHelperCommand(
            (string) Str::ulid(),
            'lone-reviewer',
            'default',
            null,
            new HelperWork(null, null, 'Review plan 7', 'Review it again.', [], true),
            TestProjects::local()->id,
        ));
    }

    public function test_a_replay_after_the_reused_helper_retired_mid_job_is_refused(): void
    {
        $requestId = (string) Str::ulid();
        $first = $this->start($requestId, 'Review plan 7');
        $this->endSessionOf($first);
        $this->retireHelperOf($first);
        $this->expectException(HelperRetired::class);

        $this->start($requestId, 'Review plan 7');
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
            TestProjects::local()->id,
        ));
    }

    private function finish(HelperReceipt $receipt): void
    {
        HelperJob::query()->findOrFail($receipt->jobId)->finish('report:1');
        $this->endSessionOf($receipt);
    }

    private function retireHelperOf(HelperReceipt $receipt): void
    {
        $agentId = HelperIdentity::query()->acrossActors()->findOrFail($receipt->identityId)->helper_actor_id;
        $this->app->make(CommandBus::class)->run(new RetireAgentCommand($agentId));
    }

    private function cancelAndEnd(HelperReceipt $receipt): void
    {
        $this->app->make(CommandBus::class)->run(
            new CancelHelperJobCommand($receipt->jobId, 'cancel-'.$receipt->jobId),
        );

        $this->endSessionOf($receipt);
    }

    /**
     * Acts as a started agent of a new project of that name, and answers the project's id.
     */
    private function startAsAgentOf(string $project): string
    {
        $this->journal->project($project);
        $this->journal->signedStart("{$project} agent", project: $project)->startRequest($this->app);
        $this->supportContainers();

        return $this->journal->projectCalled($project)->id;
    }
}
