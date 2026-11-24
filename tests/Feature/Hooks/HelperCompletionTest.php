<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Commands\CancelLaunch\CancelLaunchCommand;
use App\Commands\CertifyPassedStops\CertifyPassedStopsCommand;
use App\Commands\RecordStopResults\RecordStopResultsCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Contracts\Sessions\StartReservations;
use App\Enums\AnswerType;
use App\Enums\CleanupStep;
use App\Enums\CommandEntry;
use App\Enums\ConversationModeType;
use App\Enums\DriverOperation;
use App\Enums\DriverType;
use App\Enums\StartOriginType;
use App\Enums\StopResultType;
use App\Events\HelperCompletionCertified;
use App\Events\HelperStopHeld;
use App\Events\LaunchCancelled;
use App\Exceptions\AgentReservedForReview;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Reviews\WorkReservation;
use App\Models\Starts\SessionPolicy;
use App\Models\Starts\StartRecord;
use App\Models\Starts\StopAttempt;
use App\Support\ActorIdentity;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EngineActor;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Values\AgentText;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartPolicy;
use App\Values\StartRequest;
use App\Values\StopCondition;
use App\Values\StopConditions;
use App\Values\StopResultReport;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
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
        $this->settle('stop-1', StopResultType::Passed, 'clean');

        $allowed = $this->stop($start, 'stop-1');
        $this->stop($start, 'stop-1');

        $this->assertSame(AnswerType::Allow, $this->typeOf($allowed));
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

        $reservation = WorkReservation::query()->with('certifiedWork')->sole();
        $this->assertSame(
            [$start->agent->id, '/workspace'],
            [$reservation->actor_id, $reservation->certifiedWork->worktree],
        );
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
            $this->settle($stopId, StopResultType::Failed, 'NOTE is not committed');
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
            $this->settle($stopId, StopResultType::Failed, $summary);
            $last = $this->stop($start, $stopId);
        }

        $this->assertSame(AnswerType::Deny, $this->typeOf($last));
        Event::assertNotDispatched(HelperStopHeld::class);
    }

    public function test_a_cancel_stops_the_runtime_and_tells_the_owner(): void
    {
        Event::fake([LaunchCancelled::class]);
        [, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $work = $this->ownerStart($session);

        $this->asOwner(new CancelLaunchCommand($session->agent_id, $session->id, 'cancel-1'));

        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::Stop)->count());
        Event::assertDispatched(LaunchCancelled::class, fn (LaunchCancelled $event) => $event->work->id === $work->id);
    }

    private function helperWithConditions(bool $requiresReview = false): TestStart
    {
        $start = TestStart::start('writing-helper');
        $policy = StartPolicy::mainOnHost('/workspace');
        SessionPolicy::create($start->session, new StartPolicy(
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
            SelectedDriver::resolve('claude-code', ModelSelection::named('claude-opus-5-5'), null, null, $this->app->make(DriverCatalogue::class)),
            StartOriginType::OwnerRequest,
            $work,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::withoutProfile(TestSelections::onHost()),
            driverType: DriverType::Headless,
        );
        StartRecord::accept($request, TestSelections::pinOf($request), ActorIdentity::system(), None::create())->startedAs($session);

        return $work;
    }

    private function settle(string $stopId, StopResultType $status, string $summary): void
    {
        $attempt = StopAttempt::query()->withoutGlobalScopes()->where('stop_id', $stopId)->sole();
        $condition = StopCondition::cleanWorktree();

        $this->asSystem(new RecordStopResultsCommand('host-1', $attempt->id, $attempt->policy_digest, 0, [
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
        $this->app->make(EngineAccess::class)->grantMaintenance(CertifyPassedStopsCommand::MAINTENANCE_SCOPE);
        $this->app->make(RequestKey::class)->set($pass);
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new CertifyPassedStopsCommand()),
        );
    }
}
