<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\DatabaseClock;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Agents\Values\StackTarget;
use App\Bus\Contracts\GuardedCommandBus;
use App\Engine\Commands\MarkSilentSessions;
use App\Engine\Support\EngineAccess;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\EngineStacks;
use App\Hooks\Actions\StartStacks;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\LifecycleStage;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\InstructionOriginRefused;
use App\Hooks\Exceptions\StackMissing;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Lifecycle\LifecycleOrigin;
use App\Hooks\Lifecycle\LifecycleOrigins;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Support\InstructionMarkers;
use App\Hooks\Support\ReservedInstructions;
use App\Hooks\Support\StackTransaction;
use App\Hooks\Values\LifecycleCommands;
use App\Records\Commands\UnlinkRecords;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Tests\Fixtures\Hooks\Lifecycle\LifecycleLog;
use Tests\Fixtures\Hooks\Lifecycle\RecordingGuardedBus;
use Tests\Fixtures\Hooks\Lifecycle\RecordingStateLoader;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Committed stack changes call onEnter, onResume and onExit on the frames that arrived, came back on top or left;
 * restoring and reading call nothing, and a failing callback rolls the change back.
 */
final class StateLifecycleTest extends TestCase
{
    use RefreshHookDatabase;

    private StackTarget $target;

    private LifecycleLog $log;

    private RecordingStateLoader $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        AgentStackRow::query()->truncate();
        $this->target = TestActors::stack(1, 10);
        $this->app->instance(
            AgentContext::class,
            new AgentContext(
                TestIds::of(1),
                TestIds::of(10),
                new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)),
                null,
            ),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent(TestIds::of(1)),
            TestStartAuthority::forAgent(TestIds::of(1)),
        );
        $this->log = new LifecycleLog();
        $this->tasks = new RecordingStateLoader($this->log);
        $plans = new RecordingStateLoader($this->log);
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($plans): void {
            $event->registry->register('test.tasks', $this->tasks);
            $event->registry->register('test.plans', $plans);
        });
        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->open($this->target));
    }

    protected function tearDown(): void
    {
        AgentStackRow::query()->truncate();

        parent::tearDown();
    }

    public function test_a_push_enters_the_new_frame_once_and_a_repeated_push_calls_nothing(): void
    {
        $this->push('A');
        $this->push('B');
        $this->push('A');

        $this->assertSame(['enter:A', 'enter:B'], $this->log->calls);
        $this->assertSame(['A', 'B'], $this->storedSubjects());
    }

    public function test_a_push_over_a_finished_top_exits_it_and_enters_the_new_frame_not_the_parent(): void
    {
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['B'];
        $this->log->calls = [];

        $this->push('C');

        $this->assertSame(['exit:B', 'enter:C'], $this->log->calls);
        $this->assertSame(['A', 'C'], $this->storedSubjects());
    }

    public function test_a_replacement_runs_the_exit_answer_then_the_enter_answer_after_commit_with_their_origins(): void
    {
        $bus = $this->recordingBus();
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['B'];
        $this->log->answers = ['exit:B' => $this->answer(1), 'enter:C' => $this->answer(2)];

        $this->push('C');

        $this->assertSame(
            [
                ['command' => UnlinkRecords::class, 'stage' => 'exit', 'ordinal' => 1, 'inTransaction' => false],
                ['command' => UnlinkRecords::class, 'stage' => 'enter', 'ordinal' => 2, 'inTransaction' => false],
            ],
            $bus->runs,
        );
    }

    public function test_a_rolled_back_change_runs_none_of_its_answers(): void
    {
        $bus = $this->recordingBus();
        $this->log->answers = ['enter:A' => $this->answer(1)];

        $this->assertThrows(fn () => $this->transaction()->run(function (): void {
            $this->app->make(AgentStacks::class)->push($this->target, $this->task('A'));

            throw SimulatedFailure::of('The change fails.');
        }), SimulatedFailure::class);

        $this->assertSame([], $bus->runs);
    }

    public function test_a_state_asking_for_a_maintenance_command_is_refused_naming_its_stage_and_runs_nothing_after_it(): void
    {
        $bus = $this->recordingBus();
        $this->log->answers = ['enter:A' => LifecycleCommands::of(new MarkSilentSessions(), ...$this->answer(1)->commands)];
        Log::spy();

        $this->push('A');

        $this->assertSame([], $bus->runs);
        Log::shouldHaveReceived('warning')->withArgs(
            fn (string $message) => str_contains($message, MarkSilentSessions::class)
                && str_contains($message, 'the enter of frame'),
        )->once();
    }

    public function test_a_task_frames_enter_writes_its_own_marker_and_its_exit_forgets_only_that_one(): void
    {
        $instructions = $this->app->make(ReservedInstructions::class);
        $markers = $this->app->make(InstructionMarkers::class);

        $this->asOrigin('frame-a', 'A', LifecycleStage::Enter, fn () => $instructions->focus(FocusInstruction::class));
        $this->asOrigin('frame-b', 'B', LifecycleStage::Enter, fn () => $instructions->focus(FocusInstruction::class));
        $this->asOrigin('frame-a', 'A', LifecycleStage::Exit, fn () => $instructions->release(ReleaseInstruction::class));

        $this->assertTrue($markers->lookup($this->target, 'frame-a')->isEmpty());
        $this->assertSame('B', $markers->lookup($this->target, 'frame-b')->get()->subjectId);

        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->close($this->target));

        $this->assertTrue($markers->lookup($this->target, 'frame-b')->isEmpty());
    }

    public function test_a_reserved_command_without_an_engine_origin_or_from_the_wrong_stage_changes_no_marker(): void
    {
        $instructions = $this->app->make(ReservedInstructions::class);

        $this->assertThrows(fn () => $instructions->focus(FocusInstruction::class), InstructionOriginRefused::class);
        $this->assertThrows(
            fn () => $this->asOrigin('frame-a', 'A', LifecycleStage::Exit, fn () => $instructions->focus(FocusInstruction::class)),
            InstructionOriginRefused::class,
        );

        $this->assertTrue($this->app->make(InstructionMarkers::class)->lookup($this->target, 'frame-a')->isEmpty());
    }

    public function test_a_second_open_of_an_open_stack_settles_nothing_and_a_close_exits_nothing(): void
    {
        $this->push('A');

        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->open($this->target));
        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->close($this->target));

        $this->assertSame(['enter:A'], $this->log->calls);
    }

    public function test_a_failing_enter_leaves_no_frame(): void
    {
        $this->push('A');
        $this->log->failingEnters = ['B'];

        try {
            $this->push('B');
            $this->fail('The failing enter was swallowed.');
        } catch (RuntimeException) {
            $this->assertSame(['A'], $this->storedSubjects());
        }
    }

    public function test_a_frame_keeps_its_entry_time_through_a_repeated_push_a_cover_a_resume_and_a_restore(): void
    {
        $this->push('A');
        $entered = $this->storedEntryTimes();

        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['B'];
        $this->popExposed($this->target);

        $this->assertEquals(['A' => $entered['A']], $this->storedEntryTimes());
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restored = $this->app->make(StackRestorer::class)->restore($row->frames, $row->target())->frames();
        $this->assertEquals($entered['A'], $restored[1]->enteredAt);
        $this->assertEquals($row->frames->all()[0]->enteredAt, $restored[0]->enteredAt);
    }

    public function test_a_new_frame_enters_at_the_server_time_of_its_push(): void
    {
        $before = $this->app->make(DatabaseClock::class)->now();
        $this->push('A');
        $after = $this->app->make(DatabaseClock::class)->now();

        $entered = $this->storedEntryTimes()['A'];
        $this->assertTrue($entered->betweenIncluded($before, $after));
    }

    public function test_the_top_pop_exits_the_exposed_finished_frames_and_resumes_nothing(): void
    {
        $this->push('P');
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['A', 'B'];
        $this->log->calls = [];

        $this->popExposed($this->target);

        $this->assertSame(['exit:B', 'exit:A'], $this->log->calls);
        $this->assertSame(['P'], $this->storedSubjects());
    }

    public function test_cleanup_of_a_clean_stack_writes_nothing(): void
    {
        $this->push('A');
        $version = AgentStackRow::query()->forTarget($this->target)->sole()->version;

        $this->popExposed($this->target);

        $this->assertSame($version, AgentStackRow::query()->forTarget($this->target)->sole()->version);
    }

    public function test_the_top_pop_leaves_a_closed_stack_as_it_is(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        AgentStackRow::query()->forTarget($this->target)->sole()->closeAt(CarbonImmutable::now());
        $this->log->calls = [];

        $this->popExposed($this->target);

        $this->assertSame([], $this->log->calls);
        $this->assertSame(['A'], $this->storedSubjects());
    }

    public function test_cleanup_of_a_stack_that_does_not_exist_is_refused(): void
    {
        AgentStackRow::query()->truncate();

        $this->expectException(StackMissing::class);

        $this->popExposed($this->target);
    }

    public function test_the_current_state_of_a_type_is_its_highest_live_frame_even_when_covered(): void
    {
        $this->push('A');
        $this->pushPlan('P');
        $this->push('C');
        $current = $this->app->make(CurrentState::class);

        $this->assertSame('C', $current->of($this->target, 'test.tasks')->get()->subject->id);
        $this->assertSame('P', $current->of($this->target, 'test.plans')->get()->subject->id);

        $this->tasks->finished = ['C'];

        $this->assertSame('A', $current->of($this->target, 'test.tasks')->get()->subject->id);
        $this->assertSame(
            [],
            array_values(array_filter($this->log->calls, fn (string $call) => ! str_starts_with($call, 'enter:'))),
        );
    }

    public function test_restoring_keeps_finished_frames_and_refuses_a_stack_past_the_limit(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restorer = $this->app->make(StackRestorer::class);

        $this->assertCount(2, $restorer->restore($row->frames, $row->target())->frames());

        $records = $row->frames->all();
        $tooMany = new FrameRecords(
            [
                $records[0],
                ...array_map(
                    fn (int $number) => new FrameRecord(
                        "frame-{$number}",
                        $this->task((string) $number),
                        false,
                        1,
                        CarbonImmutable::now(),
                    ),
                    range(1, 100),
                ),
            ],
        );

        $this->expectException(StackTooDeep::class);

        $restorer->restore($tooMany, new StackTarget('agent-1', 'session-1'));
    }

    /**
     * Stack changes commit for real through StackTransaction, so no wrapping transaction; the stacks are emptied around
     * each test instead.
     *
     * @return array<int, string>
     */
    protected function connectionsToTransact(): array
    {
        return [];
    }

    private function push(string $subject): void
    {
        $this->transaction()->run(
            fn () => $this->app->make(AgentStacks::class)->push($this->target, $this->task($subject)),
        );
    }

    private function pushPlan(string $subject): void
    {
        $this->transaction()->run(
            fn () => $this->app->make(AgentStacks::class)->push(
                $this->target,
                new StateReference('test.plans', new SubjectReference($subject, 1)),
            ),
        );
    }

    private function task(string $subject): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($subject, 1));
    }

    /**
     * @return list<string>
     */
    private function storedSubjects(): array
    {
        $frames = AgentStackRow::query()->forTarget($this->target)->sole()->frames->all();

        return array_values(
            array_map(
                fn (
                    FrameRecord $frame,
                ) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '',
                array_slice($frames, 1),
            ),
        );
    }

    /**
     * Pops the target's exposed frames as the engine would, with a frame grant for it.
     */
    private function popExposed(StackTarget $target): void
    {
        $this->app->make(EngineAccess::class)->grantFrame($target, 'frame-of-the-tick');
        $this->transaction()->run(fn () => $this->app->make(EngineStacks::class)->popExposed($target));
    }

    /**
     * @return array<string, CarbonImmutable>
     */
    private function storedEntryTimes(): array
    {
        $frames = array_slice(AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(), 1);

        return array_combine(
            array_map(
                fn (
                    FrameRecord $frame,
                ) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '',
                $frames,
            ),
            array_map(fn (FrameRecord $frame) => $frame->enteredAt, $frames),
        );
    }

    private function recordingBus(): RecordingGuardedBus
    {
        $bus = new RecordingGuardedBus(
            $this->app->make(LifecycleOrigins::class),
            fn () => $this->app->make(ConnectionInterface::class)->transactionLevel(),
        );
        $this->app->instance(GuardedCommandBus::class, $bus);

        return $bus;
    }

    private function answer(int $number): LifecycleCommands
    {
        return LifecycleCommands::of(new UnlinkRecords(
            TestActors::record('tasks.task', $number),
            TestActors::record('tasks.task', $number + 100),
        ));
    }

    /**
     * @param  Closure(): void  $work
     */
    private function asOrigin(string $frameId, string $subject, LifecycleStage $stage, Closure $work): void
    {
        $reference = new StateReference('tasks.working', new SubjectReference($subject, 1));
        $origin = new LifecycleOrigin($this->target, 'transition-1', 1, $frameId, $reference, $stage);
        $this->app->make(LifecycleOrigins::class)->within($origin, $work);
    }

    private function transaction(): StackTransaction
    {
        return $this->app->make(StackTransaction::class);
    }
}
