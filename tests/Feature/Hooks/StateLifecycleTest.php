<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\DatabaseClock;
use App\AgentRequests\Support\SignedCall;
use App\Agents\Exceptions\StackTargetRefused;
use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use App\Hooks\Actions\AgentStacks;
use App\Hooks\Actions\LaunchStacks;
use App\Hooks\Contracts\CurrentState;
use App\Hooks\Contracts\StackCleanup;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\ReadyStateType;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\StackMissing;
use App\Hooks\Exceptions\StackTooDeep;
use App\Hooks\Models\AgentStackRow;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use App\Hooks\Support\StackTransaction;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use RuntimeException;
use Tests\Fixtures\Hooks\Lifecycle\LifecycleLog;
use Tests\Fixtures\Hooks\Lifecycle\RecordingStateLoader;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
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

        DB::table('agent_stacks')->truncate();
        $this->target = new StackTarget(TestIds::of(1), TestIds::of(10));
        $this->app->instance(AgentContext::class, new AgentContext(TestIds::of(1), TestIds::of(10), 'hooks.main_ready', new SignedCall('call-1', CarbonImmutable::now(), str_repeat('a', 64)), null));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(TestIds::of(1)));
        $this->log = new LifecycleLog;
        $this->tasks = new RecordingStateLoader($this->log);
        $plans = new RecordingStateLoader($this->log);
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($plans): void {
            $event->registry->register('test.tasks', $this->tasks);
            $event->registry->register('test.plans', $plans);
        });
        $this->transaction()->run(fn () => $this->app->make(LaunchStacks::class)->open($this->target, ReadyStateType::MainAgent));
    }

    protected function tearDown(): void
    {
        DB::table('agent_stacks')->truncate();

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

    public function test_a_push_over_a_finished_top_exits_it_and_enters_the_new_frame_without_resuming_the_parent(): void
    {
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['B'];
        $this->log->calls = [];

        $this->push('C');

        $this->assertSame(['exit:B', 'enter:C'], $this->log->calls);
        $this->assertSame(['A', 'C'], $this->storedSubjects());
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
        $this->transaction()->run(fn () => $this->cleanup()->removeFinished($this->target));

        $this->assertEquals(['A' => $entered['A']], $this->storedEntryTimes());
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restored = $this->app->make(StackRestorer::class)->restore($row->frames, ReadyStateType::MainAgent)->frames();
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

    public function test_cleanup_exits_finished_frames_and_resumes_the_frame_back_on_top(): void
    {
        $this->push('P');
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['A', 'B'];
        $this->log->calls = [];

        $this->transaction()->run(fn () => $this->cleanup()->removeFinished($this->target));

        $this->assertSame(['exit:B', 'exit:A', 'resume:P'], $this->log->calls);
        $this->assertSame(['P'], $this->storedSubjects());
    }

    public function test_cleanup_of_a_clean_stack_writes_nothing(): void
    {
        $this->push('A');
        $version = AgentStackRow::query()->forTarget($this->target)->sole()->version;

        $this->transaction()->run(fn () => $this->cleanup()->removeFinished($this->target));

        $this->assertSame($version, AgentStackRow::query()->forTarget($this->target)->sole()->version);
    }

    public function test_cleanup_leaves_a_closed_stack_as_it_is_and_refuses_a_missing_or_foreign_one(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        AgentStackRow::query()->forTarget($this->target)->sole()->closeAt(CarbonImmutable::now());
        $this->log->calls = [];

        $this->transaction()->run(fn () => $this->cleanup()->removeFinished($this->target));

        $this->assertSame([], $this->log->calls);
        $this->assertSame(['A'], $this->storedSubjects());
        $this->expectException(StackTargetRefused::class);

        $this->transaction()->run(fn () => $this->cleanup()->removeFinished(new StackTarget(TestIds::of(2), TestIds::of(20))));
    }

    public function test_cleanup_of_a_stack_that_does_not_exist_is_refused(): void
    {
        DB::table('agent_stacks')->truncate();

        $this->expectException(StackMissing::class);

        $this->transaction()->run(fn () => $this->cleanup()->removeFinished($this->target));
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
        $this->assertSame([], array_values(array_filter($this->log->calls, fn (string $call) => ! str_starts_with($call, 'enter:'))));
    }

    public function test_restoring_keeps_finished_frames_and_refuses_a_stack_past_the_limit(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restorer = $this->app->make(StackRestorer::class);

        $this->assertCount(2, $restorer->restore($row->frames, ReadyStateType::MainAgent)->frames());

        $records = $row->frames->all();
        $tooMany = new FrameRecords([$records[0], ...array_map(fn (int $number) => new FrameRecord("frame-{$number}", $this->task((string) $number), false, 1, CarbonImmutable::now()), range(1, 100))]);

        $this->expectException(StackTooDeep::class);

        $restorer->restore($tooMany, ReadyStateType::MainAgent);
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
        $this->transaction()->run(fn () => $this->app->make(AgentStacks::class)->push($this->target, $this->task($subject)));
    }

    private function pushPlan(string $subject): void
    {
        $this->transaction()->run(fn () => $this->app->make(AgentStacks::class)->push($this->target, new StateReference('test.plans', new SubjectReference($subject, 1))));
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

        return array_values(array_map(fn (FrameRecord $frame) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '', array_slice($frames, 1)));
    }

    private function cleanup(): StackCleanup
    {
        return $this->app->make(StackCleanup::class);
    }

    /**
     * @return array<string, CarbonImmutable>
     */
    private function storedEntryTimes(): array
    {
        $frames = array_slice(AgentStackRow::query()->forTarget($this->target)->sole()->frames->all(), 1);

        return array_combine(
            array_map(fn (FrameRecord $frame) => $frame->reference->subject instanceof SubjectReference ? $frame->reference->subject->id : '', $frames),
            array_map(fn (FrameRecord $frame) => $frame->enteredAt, $frames),
        );
    }

    private function transaction(): StackTransaction
    {
        return $this->app->make(StackTransaction::class);
    }
}
