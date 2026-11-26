<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Work\CurrentState;
use App\Events\Hooks\StateTypesRequested;
use App\Exceptions\StackMissing;
use App\Exceptions\StackTooDeep;
use App\Models\Agents\AgentStackRow;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\AgentStacks;
use App\Support\EngineAccess;
use App\Support\EngineStacks;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\ServerClock;
use App\Support\SignedCall;
use App\Support\Stack\StackRestorer;
use App\Support\StackTransaction;
use App\Support\StartStacks;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Stacks\FinishableState;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Pushes, pops and restores keep each frame's entry time, drop finished frames only where they are exposed, and refuse
 * a stack deeper than its limit.
 */
final class StackChangeTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agent_stacks'];

    private StackTarget $target;

    private FinishedSubjects $tasks;

    protected function setUp(): void
    {
        parent::setUp();

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
            ActorReference::forAgent(TestIds::of(1)),
            TestStartAuthority::forAgent(TestIds::of(1)),
        );
        $this->tasks = new FinishedSubjects();
        $this->app->instance(FinishedSubjects::class, $this->tasks);
        Event::listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register(RegisteredStateType::named('test.tasks', FinishableState::class));
            $event->registry->register(RegisteredStateType::named('test.plans', FinishableState::class));
        });
        $this->transaction()->run(fn () => $this->app->make(StartStacks::class)->open($this->target));
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
        $restored = $this->app->make(StackRestorer::class)->restore($row->frames, $row->target)->frames();
        $this->assertEquals($entered['A'], $restored[1]->enteredAt);
        $this->assertEquals($row->frames->all()[0]->enteredAt, $restored[0]->enteredAt);
    }

    public function test_a_new_frame_enters_at_the_server_time_of_its_push(): void
    {
        $before = $this->app->make(ServerClock::class)->now();
        $this->push('A');
        $after = $this->app->make(ServerClock::class)->now();

        $entered = $this->storedEntryTimes()['A'];
        $this->assertTrue($entered->betweenIncluded($before, $after));
    }

    public function test_the_top_pop_removes_the_exposed_finished_frames(): void
    {
        $this->push('P');
        $this->push('A');
        $this->push('B');
        $this->tasks->finished = ['A', 'B'];

        $this->popExposed($this->target);

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

        $this->popExposed($this->target);

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
    }

    public function test_restoring_keeps_finished_frames_and_refuses_a_stack_past_the_limit(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restorer = $this->app->make(StackRestorer::class);

        $this->assertCount(2, $restorer->restore($row->frames, $row->target)->frames());

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
                new StateReference('test.plans', new SubjectReference($subject, 1), ['subject' => 'plan-'.$subject]),
            ),
        );
    }

    private function task(string $subject): StateReference
    {
        return new StateReference('test.tasks', new SubjectReference($subject, 1), ['subject' => $subject]);
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

    private function transaction(): StackTransaction
    {
        return $this->app->make(StackTransaction::class);
    }
}
