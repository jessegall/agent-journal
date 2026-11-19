<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Hooks\Contracts\ConditionalStateType;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Enums\NoSubject;
use App\Hooks\Events\StateTypesRequested;
use App\Hooks\Exceptions\InvalidBottomState;
use App\Hooks\Exceptions\StateSchemaUnknown;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\Exceptions\StateTypeUnknown;
use App\Hooks\Stack\RegisteredStateFactory;
use App\Hooks\Stack\StackRestorer;
use App\Hooks\Stack\StateTypes;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Hooks\Storage\FrameRecord;
use App\Hooks\Storage\FrameRecords;
use Carbon\CarbonImmutable;
use Closure;
use Domain\Tasks\Enums\TaskWorkState;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\ClosureStateLoader;
use Tests\Fixtures\Hooks\FixedFileEditPermission;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryTaskLoader;
use Tests\Fixtures\Hooks\ScriptedState;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\FixedServerClock;

final class StackRestorerTest extends TestCase
{
    private InMemoryTaskLoader $tasks;

    private StackRestorer $restorer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tasks = new InMemoryTaskLoader([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        $this->restorer = $this->restorerWith($this->tasks);
    }

    public function test_a_stored_stack_comes_back_with_its_frames_in_order(): void
    {
        $stack = $this->restorer->restore($this->records($this->bottom(), $this->task('task-42', 42)));

        $this->assertSame(['ready', 'task-42'], $stack->frameIds());
        $this->assertSame(AnswerType::Deny, $stack->answer(HookInputs::all()['stop'])->decision->answerType());
    }

    public function test_each_restore_reads_the_subjects_fresh(): void
    {
        $records = $this->records($this->bottom(), $this->task('task-42', 42));

        $before = $this->restorer->restore($records);
        $this->tasks->tasks[42] = TaskWorkState::Finished;
        $after = $this->restorer->restore($records);

        $this->assertSame([false], array_map(fn ($frame) => $frame->isFinished(), array_slice($before->frames(), 1)));
        $this->assertSame([true], array_map(fn ($frame) => $frame->isFinished(), array_slice($after->frames(), 1)));
    }

    public function test_restoring_keeps_a_finished_frame_and_only_an_exposed_one_is_popped(): void
    {
        $this->tasks->tasks[42] = TaskWorkState::Cancelled;

        $stack = $this->restorer->restore(
            $this->records($this->bottom(), $this->task('task-42', 42), $this->task('task-43', 43)),
        );

        $this->assertSame(['ready', 'task-42', 'task-43'], $stack->frameIds());
        $this->assertSame(['ready', 'task-42', 'task-43'], $stack->withoutExposedInactive()->frameIds());
        $this->assertSame('task-43', $stack->top()->id);
    }

    public function test_the_bottom_state_follows_what_the_profile_lets_change(): void
    {
        $helper = $this->restorerWith($this->tasks, mayEditFiles: false)->restore($this->records($this->bottom()));

        $edit = HookInputs::all()['file edit'];

        $this->assertSame(AnswerType::Deny, $helper->answer($edit)->decision->answerType());
    }

    public function test_a_stack_without_a_bottom_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restorer->restore($this->records($this->task('task-42', 42)));
    }

    public function test_an_empty_stack_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restorer->restore($this->records());
    }

    public function test_a_second_bottom_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::repeated('ready-2'));

        $this->restorer->restore($this->records($this->bottom(), $this->bottom(id: 'ready-2')));
    }

    public function test_a_bottom_of_another_type_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::ofAnotherType('hooks.main_ready', ReadyState::TYPE_KEY));

        $this->restorer->restore($this->records($this->bottom('hooks.main_ready')));
    }

    public function test_an_unknown_state_type_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        $this->restorer->restore(
            $this->records($this->bottom(), new FrameRecord('note-1', new StateReference('notes.reading', NoSubject::None), false, 1, CarbonImmutable::now())),
        );
    }

    public function test_a_frame_stored_in_an_unknown_version_is_an_error(): void
    {
        $restorer = $this->restorerWith(new InMemoryTaskLoader([42 => TaskWorkState::Active], version: 2));

        $this->expectException(StateSchemaUnknown::class);

        $restorer->restore($this->records($this->bottom(), $this->task('task-42', 42)));
    }

    public function test_a_missing_subject_is_an_error_and_not_a_finished_frame(): void
    {
        $this->expectException(StateSubjectMissing::class);

        $this->restorer->restore($this->records($this->bottom(), $this->task('task-99', 99)));
    }

    public function test_a_switched_off_frame_is_restored_and_validated_and_left_out_only_on_request(): void
    {
        $events = new Dispatcher();
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event): void {
            $event->registry->register('tasks.working', $this->tasks);
            $event->registry->register('test.switched_off', new ClosureStateLoader(fn () => new SwitchableState(false)));
        });
        $types = new StateTypes($events, FixedFileEditPermission::loader());
        $restorer = new StackRestorer($types, new RegisteredStateFactory($types, new FixedServerClock(CarbonImmutable::parse('2026-11-18 12:00:00'))));
        $switchedOff = new FrameRecord('review', new StateReference('test.switched_off', NoSubject::None), false, 1, CarbonImmutable::now());

        $stack = $restorer->restore($this->records($this->bottom(), $this->task('task-42', 42), $switchedOff));

        $this->assertSame(['ready', 'task-42', 'review'], $stack->frameIds());
        $this->assertSame(['ready', 'task-42'], $stack->withoutExposedInactive()->frameIds());

        $this->expectException(StateSchemaUnknown::class);

        $restorer->restore($this->records($this->bottom(), new FrameRecord('review', new StateReference('test.switched_off', NoSubject::None), false, 2, CarbonImmutable::now())));
    }

    public function test_a_frame_of_a_switched_off_type_is_restored_reports_off_and_leaves_on_request(): void
    {
        $loaded = 0;
        $switchedOffType = new class(function () use (&$loaded) {
            $loaded++;

            return ScriptedState::delegating();
        }) implements ConditionalStateType, StateLoader
        {

            public function __construct(private readonly Closure $make) {}

            public function statesFor(StateReferences $references): StateSet
            {
                return StateSet::build($references, fn (): AgentState => ($this->make)());
            }

            public function schemaVersion(): int
            {
                return 1;
            }

            public function isEnabled(): bool
            {
                return false;
            }
        };
        $events = new Dispatcher();
        $events->listen(StateTypesRequested::class, function (StateTypesRequested $event) use ($switchedOffType): void {
            $event->registry->register('tasks.working', $this->tasks);
            $event->registry->register('plans.working', $switchedOffType);
        });
        $types = new StateTypes($events, FixedFileEditPermission::loader());
        $restorer = new StackRestorer($types, new RegisteredStateFactory($types, new FixedServerClock(CarbonImmutable::parse('2026-11-18 12:00:00'))));

        $stack = $restorer->restore($this->records($this->bottom(), new FrameRecord('plan-7', new StateReference('plans.working', NoSubject::None), false, 1, CarbonImmutable::now())));

        $this->assertSame(1, $loaded);
        $this->assertSame([true, false], array_map(fn ($frame) => $frame->isEnabled(), $stack->frames()));
        $this->assertSame(['ready'], $stack->withoutExposedInactive()->frameIds());
    }

    private function restorerWith(InMemoryTaskLoader $tasks, bool $mayEditFiles = true): StackRestorer
    {
        $events = new Dispatcher();
        $events->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $event->registry->register('tasks.working', $tasks));
        $types = new StateTypes($events, FixedFileEditPermission::loader($mayEditFiles));

        return new StackRestorer($types, new RegisteredStateFactory($types, new FixedServerClock(CarbonImmutable::parse('2026-11-18 12:00:00'))));
    }

    private function records(FrameRecord ...$records): FrameRecords
    {
        return new FrameRecords(array_values($records));
    }

    private function bottom(string $typeKey = ReadyState::TYPE_KEY, string $id = 'ready'): FrameRecord
    {
        return new FrameRecord($id, new StateReference($typeKey, NoSubject::None), true, 1, CarbonImmutable::now());
    }

    private function task(string $id, int $number): FrameRecord
    {
        return new FrameRecord($id, new StateReference('tasks.working', new SubjectReference((string) $number, 1)), false, 1, CarbonImmutable::now());
    }
}
