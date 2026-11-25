<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Commands\Agents\CancelSessionStart\CancelSessionStartCommand;
use App\Commands\Sessions\CertifyPassedStops\CertifyPassedStopsCommand;
use App\Commands\Sessions\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Agents\ConversationModeType;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Hooks\AnswerType;
use App\Enums\Sessions\StartOriginType;
use App\Enums\Sessions\StopConditionResultType;
use App\Events\Hooks\HelperCompletionCertified;
use App\Events\Hooks\HelperStopHeld;
use App\Events\Sessions\SessionStartCancelled;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Models\Sessions\StopCheck;
use App\Support\ActorIdentity;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Support\SystemActor;
use App\Values\AgentText;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;
use App\Values\StopConditions;
use App\Values\TrustedEntryAuthority;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\AsksTheStopGate;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A started helper's work is complete only on stop evidence: a passed stop certifies it once, a reader
 * with no conditions finishes on its stack checks alone, a failed stop refuses and the third unchanged failure ends
 * the turn with one held notice, reviewed work keeps its actor and checkout from the certificate on, a passed stop that never comes back is certified once by the engine, and a cancel
 * stops the runtime and tells the owner while the workspace stays.
 */
#[TimeLimit(seconds: 5, reason: 'It starts test agent sessions, opens a runtime and empties the hook tables.')]
final class HelperCompletionTest extends TestCase
{
    use AsksTheStopGate;
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;
    use RunsTrustedCommands;
    use SendsHostCalls;

    public function test_a_passed_stop_certifies_the_work_once(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions();
        $work = $this->startedFor($start);
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopConditionResultType::Passed, 'clean');

        $allowed = $this->stop($start, 'stop-1');
        $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $this->typeOf($allowed));
        $this->assertNotNull(StopCheck::query()->withoutGlobalScopes()->sole()->certified_at);
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
        Event::assertDispatched(
            HelperCompletionCertified::class,
            fn (HelperCompletionCertified $event) => $event->work->id === $work->id,
        );
    }

    public function test_a_dirty_writer_cannot_finish_while_its_checks_run_or_fail(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);

        $running = $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopConditionResultType::Failed, 'NOTE is not committed');
        $refused = $this->stop($start, 'stop-1');

        $this->assertSame([TestText::words(AgentText::of('core.stop.checks_running'))], $this->messagesOf($running));
        $this->assertSame(AnswerType::Deny, $this->typeOf($refused));
        Event::assertNotDispatched(HelperCompletionCertified::class);
    }

    public function test_a_reader_with_no_conditions_finishes_on_its_stack_checks_alone(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = TestStart::start('read-only-helper');
        SessionPolicy::create($start->session, StartPolicy::mainOnHost('/workspace'));
        $this->startedFor($start);

        $decision = $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $this->typeOf($decision));
        $this->assertSame([], $this->messagesOf($decision));
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
    }

    public function test_three_unchanged_failures_end_the_turn_with_one_held_notice(): void
    {
        Event::fake([HelperStopHeld::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);
        $decisions = [];

        foreach (['stop-1', 'stop-2', 'stop-3', 'stop-4'] as $stopId) {
            $this->stop($start, $stopId);
            $this->settle($stopId, StopConditionResultType::Failed, 'NOTE is not committed');
            $decisions[] = $this->typeOf($this->stop($start, $stopId));
        }

        $this->assertSame([AnswerType::Deny, AnswerType::Deny, AnswerType::Allow, AnswerType::Allow], $decisions);
        Event::assertDispatchedTimes(HelperStopHeld::class, 1);
    }

    public function test_a_changed_failure_starts_the_count_again(): void
    {
        Event::fake([HelperStopHeld::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);

        foreach (['stop-1' => 'first', 'stop-2' => 'first', 'stop-3' => 'second'] as $stopId => $summary) {
            $this->stop($start, $stopId);
            $this->settle($stopId, StopConditionResultType::Failed, $summary);
            $last = $this->stop($start, $stopId);
        }

        $this->assertSame(AnswerType::Deny, $this->typeOf($last));
        Event::assertNotDispatched(HelperStopHeld::class);
    }

    public function test_a_cancel_stops_the_runtime_and_tells_the_owner(): void
    {
        Event::fake([SessionStartCancelled::class]);
        [, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $work = $this->ownerStart($session);

        $this->asOwner(new CancelSessionStartCommand($session->agent_id, $session->id, 'cancel-1'));

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
        Event::assertDispatched(SessionStartCancelled::class, fn (SessionStartCancelled $event) => $event->work->id === $work->id);
    }

    private function helperWithConditions(): TestStart
    {
        $start = TestStart::start('writing-helper');
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
            SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class)),
            StartOriginType::OwnerRequest,
            $work,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        SessionRequest::create($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create())->startedAs($session);

        return $work;
    }

    private function settle(string $stopId, StopConditionResultType $status, string $summary): void
    {
        $attempt = StopCheck::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->asSystem(new RecordStopConditionResultsCommand('host-1', $attempt->id, $attempt->policy_digest, 0, [
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
        ]));
    }

    /**
     * Runs the engine's sweep of passed stops, as one engine pass does.
     */
    private function certifyPassedStops(string $pass): void
    {
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(CertifyPassedStopsCommand::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set($pass);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new CertifyPassedStopsCommand()),
        );
    }
}
