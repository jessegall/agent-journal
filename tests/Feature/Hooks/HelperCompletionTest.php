<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\TrustedEntryAuthority;
use App\Agents\Commands\CancelLaunch;
use App\Agents\Contracts\StartReservations;
use App\Agents\Enums\CleanupStep;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\StartOriginType;
use App\Agents\Events\LaunchCancelled;
use App\Agents\Exceptions\AgentReservedForReview;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Models\WorkReservation;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use App\Agents\Values\StopCondition;
use App\Agents\Values\StopConditions;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\CommandEntrance;
use App\Bus\Support\RequestKey;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EngineActor;
use App\Hooks\Commands\CertifyPassedStops;
use App\Hooks\Commands\RecordStopResults;
use App\Hooks\Contracts\StopConditionGate;
use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\StopResultType;
use App\Hooks\Events\HelperCompletionCertified;
use App\Hooks\Events\HelperStopHeld;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Models\StopAttempt;
use App\Hooks\Support\StopAttemptGate;
use App\Hooks\Values\StopResultReport;
use App\Records\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use PhpOption\None;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A started helper's work is complete only on stop evidence (task 415): a passed stop certifies it once, a reader
 * with no conditions finishes on its stack checks alone, a failed stop refuses and the third unchanged failure ends
 * the turn with one held notice, reviewed work keeps its actor and checkout from the certificate on, a passed stop that never comes back is certified once by the engine, and a cancel
 * stops the runtime and tells the owner while the workspace stays.
 */
#[TimeLimit(seconds: 5, reason: 'It starts test agent sessions, opens a runtime and empties the hook tables.')]
final class HelperCompletionTest extends TestCase
{
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
        $this->settle('stop-1', StopResultType::Passed, 'clean');

        $allowed = $this->stop($start, 'stop-1');
        $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $allowed->answerType());
        $this->assertNotNull(StopAttempt::query()->withoutGlobalScopes()->sole()->certified_at);
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
        Event::assertDispatched(
            HelperCompletionCertified::class,
            fn (HelperCompletionCertified $event) => $event->work->id === $work->id,
        );
    }

    public function test_a_stop_that_never_comes_back_is_certified_once_by_the_engine(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopResultType::Passed, 'clean');

        $this->certifyPassedStops('pass-1');
        $this->certifyPassedStops('pass-2');
        $this->stop($start, 'stop-1');

        $this->assertNotNull(StopAttempt::query()->withoutGlobalScopes()->sole()->certified_at);
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
    }

    public function test_reviewed_work_holds_its_actor_and_checkout_even_when_the_handoff_is_lost(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions(requiresReview: true);
        $this->startedFor($start);
        $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopResultType::Passed, 'clean');

        $this->certifyPassedStops('pass-1');
        $start->session->endAt(CarbonImmutable::now());

        $reservation = WorkReservation::query()->sole();
        $this->assertSame([$start->agent->id, '/workspace'], [$reservation->actor_id, $reservation->checkout]);
        Event::assertDispatchedTimes(HelperCompletionCertified::class, 1);
        $this->assertThrows(
            fn () => $this->app->make(StartReservations::class)->reserve(ActorIdentity::of($start->agent)),
            AgentReservedForReview::class,
        );
        $this->assertNotContains(
            'checkout',
            array_map(fn (CleanupStep $step) => $step->value, CleanupStep::cases()),
        );
    }

    public function test_a_dirty_writer_cannot_finish_while_its_checks_run_or_fail(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = $this->helperWithConditions();
        $this->startedFor($start);

        $running = $this->stop($start, 'stop-1');
        $this->settle('stop-1', StopResultType::Failed, 'NOTE is not committed');
        $refused = $this->stop($start, 'stop-1');

        $this->assertSame([StopAttemptGate::CHECKS_RUNNING], $running->messages);
        $this->assertSame(AnswerType::Deny, $refused->answerType());
        Event::assertNotDispatched(HelperCompletionCertified::class);
    }

    public function test_a_reader_with_no_conditions_finishes_on_its_stack_checks_alone(): void
    {
        Event::fake([HelperCompletionCertified::class]);
        $start = TestStart::start('read-only-helper');
        SessionPolicy::freeze($start->session, StartPolicy::mainOnHost('/workspace'));
        $this->startedFor($start);

        $decision = $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $decision->answerType());
        $this->assertSame([StopAttemptGate::NO_CHECKS_REQUIRED], $decision->messages);
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
            $this->settle($stopId, StopResultType::Failed, 'NOTE is not committed');
            $decisions[] = $this->stop($start, $stopId)->answerType();
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
            $this->settle($stopId, StopResultType::Failed, $summary);
            $last = $this->stop($start, $stopId);
        }

        $this->assertSame(AnswerType::Deny, $last->answerType());
        Event::assertNotDispatched(HelperStopHeld::class);
    }

    public function test_a_cancel_stops_the_runtime_and_tells_the_owner(): void
    {
        Event::fake([LaunchCancelled::class]);
        [, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $work = $this->ownerStart($session);

        $this->asOwner(new CancelLaunch($session->agent_id, $session->id, 'cancel-1'));

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
        Event::assertDispatched(LaunchCancelled::class, fn (LaunchCancelled $event) => $event->work->id === $work->id);
    }

    private function helperWithConditions(bool $requiresReview = false): TestStart
    {
        $start = TestStart::start('writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        SessionPolicy::freeze($start->session, new StartPolicy(
            $policy->access,
            StopConditions::make([StopCondition::cleanWorktree()]),
            $policy->execution,
            'writing-helper',
            1,
            null,
            $requiresReview,
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
        $work = new RecordIdentity('helpers.job', (string) Str::ulid());
        $request = new StartRequest(
            TestSelections::requestId(),
            $session->agent_id,
            SelectedProgram::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null),
            StartOriginType::OwnerRequest,
            "{$work->type}:{$work->id}",
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
        );
        StartRecord::accept($request, ActorIdentity::system(), None::create())->startedAs($session);

        return $work;
    }

    private function stop(TestStart $start, string $stopId): Decision
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');
        $start->startRequest($this->app);

        return $this->app->make(StopConditionGate::class)->answer($hook);
    }

    private function settle(string $stopId, StopResultType $status, string $summary): void
    {
        $attempt = StopAttempt::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->asSystem(new RecordStopResults('host-1', $attempt->id, $attempt->policy_digest, 0, [
            new StopResultReport(
                $condition->key,
                $condition->definitionHash(),
                $status,
                '2026-11-20T01:00:00Z',
                '2026-11-20T01:00:01Z',
                $status === StopResultType::Passed ? 0 : 1,
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
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(CertifyPassedStops::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set($pass);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new CertifyPassedStops()),
        );
    }
}
