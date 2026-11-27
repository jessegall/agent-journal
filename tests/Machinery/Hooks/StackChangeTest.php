<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Actors\Contracts\CurrentActorSetter;
use App\Agents\Exceptions\StackMissing;
use App\Api\SignedCall;
use App\Engine\EngineAccess;
use App\Events\Hooks\StateTypesRequested;
use App\Models\Agents\AgentStackRow;
use App\Stacks\AgentStacks;
use App\Stacks\Contracts\Work\CurrentState;
use App\Stacks\EngineStacks;
use App\Stacks\Exceptions\StackTooDeep;
use App\Stacks\References\StateReference;
use App\Stacks\References\SubjectReference;
use App\Stacks\SessionStateLifecycle;
use App\Stacks\StackRestorer;
use App\Stacks\StateLoading\RegisteredStateType;
use App\Support\ActorReference;
use App\Support\AgentContext;
use App\Support\ServerClock;
use App\Support\StackTransaction;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Hooks\Stacks\FinishableState;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Hooks\SubjectIds;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * Pushes, pops and restores keep each frame's entry time, drop finished frames only where they are exposed, and refuse
 * a stack deeper than its limit.
 */
#[TestsMachinery(AgentStacks::class)]
final class StackChangeTest extends TestCase
{
    /**
     * The frames every stack opens with: the ready bottom and the profile state.
     */
    private const int BASE_FRAMES = 2;

    use CommitsHookRows;

    private const array TABLES = ['agent_stacks'];

    private StackTarget $target;

    private FinishedSubjects $tasks;

    /**
     * The name the test gave each subject, by the subject id its frame stores.
     *
     * @var array<string, string>
     */
    private array $names = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();

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
        $this->transaction()->run(fn () => $this->app->make(SessionStateLifecycle::class)->open($this->target));
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
        $this->assertEquals($entered['A'], $restored[self::BASE_FRAMES]->enteredAt);
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

        $this->assertSame('C', $this->nameOf($current->of($this->target, 'test.tasks')->get()));
        $this->assertSame('P', $this->nameOf($current->of($this->target, 'test.plans')->get()));

        $this->tasks->finished = ['C'];

        $this->assertSame('A', $this->nameOf($current->of($this->target, 'test.tasks')->get()));
    }

    public function test_restoring_keeps_finished_frames_and_refuses_a_stack_past_the_limit(): void
    {
        $this->push('A');
        $this->tasks->finished = ['A'];
        $row = AgentStackRow::query()->forTarget($this->target)->sole();
        $restorer = $this->app->make(StackRestorer::class);

        $this->assertCount(self::BASE_FRAMES + 1, $restorer->restore($row->frames, $row->target)->frames());

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
                $this->named('test.plans', $subject, 'plan-'.$subject),
            ),
        );
    }

    private function task(string $subject): StateReference
    {
        return $this->named('test.tasks', $subject, $subject);
    }

    /**
     * A reference to the state of the type about the subject its data names, remembered by the test's name for it.
     */
    private function named(string $type, string $name, string $subject): StateReference
    {
        $this->names[SubjectIds::of($subject)] = $name;

        return new StateReference($type, new SubjectReference(SubjectIds::of($subject), 1), ['subject' => $subject]);
    }

    private function nameOf(StateReference $reference): string
    {
        return $reference->subject instanceof SubjectReference ? $this->names[$reference->subject->id] : '';
    }

    /**
     * The subject each frame above the base was pushed for, by the name the test gave it.
     *
     * @return list<string>
     */
    private function storedSubjects(): array
    {
        $frames = AgentStackRow::query()->forTarget($this->target)->sole()->frames->all();

        return array_values(
            array_map(
                fn (FrameRecord $frame) => $this->nameOf($frame->reference),
                array_slice($frames, self::BASE_FRAMES),
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
        $stored = AgentStackRow::query()->forTarget($this->target)->sole()->frames->all();
        $frames = array_slice($stored, self::BASE_FRAMES);

        return array_combine(
            array_map(
                fn (FrameRecord $frame) => $this->nameOf($frame->reference),
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
