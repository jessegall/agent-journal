<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Contracts\Authorization\OperationPolicy;
use App\Enums\NoSubject;
use App\Events\StateTypesRequested;
use App\Exceptions\InvalidBottomState;
use App\Exceptions\StateSchemaUnknown;
use App\Exceptions\StateTypeUnknown;
use App\Exceptions\StateValuesRefused;
use App\Support\References\StateReference;
use App\Support\References\SubjectReference;
use App\Support\Stack\AgentStack;
use App\Support\Stack\StackRestorer;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\States\Contracts\StopConditionGate;
use App\Support\States\ReadyState;
use App\Support\Storage\FrameRecord;
use App\Support\Storage\FrameRecords;
use App\Values\StackTarget;
use Carbon\CarbonImmutable;
use Domain\Tasks\Enums\TaskState;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryTasks;
use Tests\Fixtures\Hooks\InMemoryTaskState;
use Tests\Fixtures\Hooks\SwitchableState;
use Tests\Support\RegistersTestStates;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * A stored stack comes back with every state built from the values its frame saved, in order, with its one ready
 * bottom; an unknown type, an unknown version or a missing value is refused by name.
 */
final class StackRestorerTest extends TestCase
{
    use RegistersTestStates;

    private InMemoryTasks $tasks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tasks = new InMemoryTasks([42 => TaskState::Started, 43 => TaskState::Started]);
        $this->app->instance(InMemoryTasks::class, $this->tasks);
        $this->app->instance(OperationPolicy::class, new FixedOperationPolicy());
        $this->app->instance(StopConditionGate::class, new AllowedStops());
        $this->registerTestState('test.tasks', InMemoryTaskState::class);
    }

    public function test_a_stored_stack_comes_back_with_its_frames_in_order(): void
    {
        $stack = $this->restore($this->bottom(), $this->task('task-42', 42));

        $this->assertSame(['ready', 'task-42'], $stack->frameIds());
        $this->assertTrue($stack->answer(HookInputs::all()['stop'], TestText::renderer())->isDenied());
    }

    public function test_a_restored_state_asks_its_collaborator_each_time(): void
    {
        $records = [$this->bottom(), $this->task('task-42', 42)];

        $restored = $this->restore(...$records);
        $this->assertFalse($restored->frames()[1]->isFinished());

        $this->tasks->tasks[42] = TaskState::Finished;

        $this->assertTrue($restored->frames()[1]->isFinished());
    }

    public function test_restoring_keeps_a_finished_frame_and_only_an_exposed_one_is_popped(): void
    {
        $this->tasks->tasks[42] = TaskState::Cancelled;

        $stack = $this->restore($this->bottom(), $this->task('task-42', 42), $this->task('task-43', 43));

        $this->assertSame(['ready', 'task-42', 'task-43'], $stack->frameIds());
        $this->assertSame(['ready', 'task-42', 'task-43'], $stack->withoutExposedInactive()->frameIds());
        $this->assertSame('task-43', $stack->top()->id);
    }

    public function test_the_bottom_state_follows_what_the_profile_lets_change(): void
    {
        $this->app->instance(OperationPolicy::class, new FixedOperationPolicy(changesFiles: false));

        $stack = $this->restore($this->bottom());

        $this->assertTrue($stack->answer(HookInputs::all()['file edit'], TestText::renderer())->isDenied());
    }

    public function test_a_stack_without_a_bottom_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restore($this->task('task-42', 42));
    }

    public function test_an_empty_stack_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restore();
    }

    public function test_a_second_bottom_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::repeated('ready-2'));

        $this->restore($this->bottom(), $this->bottom(id: 'ready-2'));
    }

    public function test_a_bottom_of_another_type_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::ofAnotherType('hooks.main_ready', ReadyState::TYPE_KEY));

        $this->restore($this->bottom('hooks.main_ready'));
    }

    public function test_an_unknown_state_type_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        $this->restore(
            $this->bottom(),
            new FrameRecord('note-1', new StateReference('notes.reading', NoSubject::None), false, 1, CarbonImmutable::now()),
        );
    }

    public function test_a_frame_stored_in_an_unknown_version_is_an_error(): void
    {
        $this->expectException(StateSchemaUnknown::class);

        $this->restore($this->bottom(), $this->task('task-42', 42, version: 2));
    }

    public function test_a_frame_missing_a_value_its_state_needs_is_refused_by_its_type(): void
    {
        $missing = new FrameRecord(
            'task-42',
            new StateReference('test.tasks', new SubjectReference('42', 1)),
            false,
            1,
            CarbonImmutable::now(),
            ['runNumber' => 1],
        );

        $this->expectExceptionObject(StateValuesRefused::missing('test.tasks', 1, 'number'));

        $this->restore($this->bottom(), $missing);
    }

    public function test_a_frame_of_a_switched_off_type_is_restored_reports_off_and_leaves_on_request(): void
    {
        $this->app->make(Dispatcher::class)->listen(
            StateTypesRequested::class,
            fn (StateTypesRequested $event) => $event->registry->register(
                RegisteredStateType::named('test.switched_off', SwitchableState::class)->switchedBy(fn (): bool => false),
            ),
        );
        $switched = new FrameRecord(
            'switched',
            new StateReference('test.switched_off', NoSubject::None),
            false,
            1,
            CarbonImmutable::now(),
            ['enabled' => true],
        );

        $stack = $this->restore($this->bottom(), $switched);

        $this->assertSame(['ready', 'switched'], $stack->frameIds());
        $this->assertFalse($stack->frames()[1]->isEnabled());
        $this->assertSame(['ready'], $stack->withoutExposedInactive()->frameIds());
    }

    private function restore(FrameRecord ...$records): AgentStack
    {
        return $this->app->make(StackRestorer::class)->restore(
            new FrameRecords(array_values($records)),
            new StackTarget('agent-1', 'session-1'),
        );
    }

    private function bottom(string $typeKey = ReadyState::TYPE_KEY, string $id = 'ready'): FrameRecord
    {
        return new FrameRecord($id, new StateReference($typeKey, NoSubject::None), true, 1, CarbonImmutable::now());
    }

    private function task(string $id, int $number, int $version = 1): FrameRecord
    {
        return new FrameRecord(
            $id,
            new StateReference('test.tasks', new SubjectReference((string) $number, 1)),
            false,
            $version,
            CarbonImmutable::now(),
            ['number' => $number, 'runNumber' => 1],
        );
    }
}
