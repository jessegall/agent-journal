<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Commands\CancelSessionStart\CancelSessionStartCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Api\Hooks\AgentStateMachine;
use App\Events\Hooks\StopCheckHeld;
use App\Events\Sessions\StopCheckCertified;
use App\Hooks\Enums\AnswerType;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\Enums\StopConditionResultType;
use App\Sessions\Values\StartPolicy;
use App\Sessions\Values\StopConditions;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartRequest;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\AsksTheProfileState;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A started agent's work is complete only on stop evidence: a passed stop certifies it once, a failed stop refuses and
 * the third unchanged failure holds the work with one notice, a passed stop that never returns is certified by the
 * engine, and a cancel stops the runtime.
 */
#[TimeLimit(seconds: 5, reason: 'It starts test agent sessions, opens a runtime and empties the hook tables.')]
#[TestsMachinery(AgentStateMachine::class)]
final class StopCompletionTest extends TestCase
{
    use AsksTheProfileState;
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    public function test_a_passed_stop_certifies_the_work_once(): void
    {
        Event::fake([StopCheckCertified::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopConditionResultType::Passed, 'clean');

        $allowed = $this->stop($start, 'stop-1');
        $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $this->typeOf($allowed));
        $this->assertNotNull(StopCheck::query()->withoutGlobalScopes()->sole()->certified_at);
        Event::assertDispatchedTimes(StopCheckCertified::class, 1);
    }

    public function test_a_reader_with_no_conditions_finishes_on_its_stack_checks_alone(): void
    {
        Event::fake([StopCheckCertified::class]);
        $start = $this->journal->signedStart('Reader', 'read-only-helper');
        SessionPolicy::create($start->session, StartPolicy::mainOnHost('/workspace'));
        $this->startedFor($start);

        $decision = $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $this->typeOf($decision));
        $this->assertSame([], $this->messagesOf($decision));
        Event::assertDispatchedTimes(StopCheckCertified::class, 1);
    }

    public function test_three_unchanged_failures_end_the_turn_with_one_held_notice(): void
    {
        Event::fake([StopCheckHeld::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);
        $decisions = [];

        foreach (['stop-1', 'stop-2', 'stop-3', 'stop-4'] as $stopId) {
            $this->stop($start, $stopId);
            $this->settle($stopId, StopConditionResultType::Failed, 'NOTE is not committed');
            $decisions[] = $this->typeOf($this->stop($start, $stopId));
        }

        $this->assertSame([AnswerType::Deny, AnswerType::Deny, AnswerType::Allow, AnswerType::Allow], $decisions);
        Event::assertDispatchedTimes(StopCheckHeld::class, 1);
    }

    public function test_a_changed_failure_starts_the_count_again(): void
    {
        Event::fake([StopCheckHeld::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);

        foreach (['stop-1' => 'first', 'stop-2' => 'first', 'stop-3' => 'second'] as $stopId => $summary) {
            $this->stop($start, $stopId);
            $this->settle($stopId, StopConditionResultType::Failed, $summary);
            $last = $this->stop($start, $stopId);
        }

        $this->assertSame(AnswerType::Deny, $this->typeOf($last));
        Event::assertNotDispatched(StopCheckHeld::class);
    }

    public function test_a_cancel_stops_the_runtime(): void
    {
        [, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);

        $this->asOwner(new CancelSessionStartCommand($session->agent_id, $session->id, 'cancel-1'));

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
    }

    private function helperWithConditions(): TestStart
    {
        $start = $this->journal->signedStart('Writer', 'writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        SessionPolicy::create($start->session, new StartPolicy(
            $policy->access,
            new StopConditions([StopCondition::cleanWorktree()]),
            $policy->execution,
            'writing-helper',
            1,
            null,
        ));

        return $start;
    }

    private function startedFor(TestStart $start): RecordIdentity
    {
        return $this->ownerStart($start->session);
    }

    /**
     * Records that an owner started the session for a helper job, as a helper dispatch does.
     */
    private function ownerStart(AgentSession $session): RecordIdentity
    {
        $work = new RecordIdentity('helpers.helper-job', (string) Str::ulid());
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            SelectedDriver::resolve(
                'claude-code',
                ModelSelection::named('claude-opus-5-5'),
                null,
                null,
                null,
                $this->app->make(DriverCatalogue::class)
            ),
            StartOriginType::OwnerRequest,
            $work,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create(
            $request,
            TestSelections::pinOf($request),
            ActorReference::system(),
            None::create(),
        )->startedAs($session);

        return $work;
    }

    private function settle(string $stopId, StopConditionResultType $status, string $summary): void
    {
        $attempt = StopCheck::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->journal->asSystem(new RecordStopConditionResultsCommand(
            'host-1',
            $attempt->id,
            $attempt->policy_digest,
            0,
            [
                new StopConditionResultReport(
                    $condition->key,
                    $condition->definitionHash(),
                    $status,
                    '2026-11-20T01:00:00Z',
                    '2026-11-20T01:00:01Z',
                    $status === StopConditionResultType::Passed ? 0 : 1,
                    null,
                    $summary,
                    null,
                    false,
                ),
            ]
        ));
    }
}
