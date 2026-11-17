<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Domain\Hooks\Decisions\AnswerKind;
use App\Domain\Hooks\Decisions\NoSubject;
use App\Domain\Hooks\Decisions\StateReference;
use App\Domain\Hooks\Decisions\SubjectReference;
use App\Domain\Hooks\Events\StateTypesRequested;
use App\Domain\Hooks\Stack\RegisteredStateFactory;
use App\Domain\Hooks\Stack\StackRestorer;
use App\Domain\Hooks\Stack\StateSchemaUnknown;
use App\Domain\Hooks\Stack\StateTypes;
use App\Domain\Hooks\States\ReadyStateType;
use App\Domain\Hooks\States\StateSubjectMissing;
use App\Domain\Hooks\States\StateTypeUnknown;
use App\Domain\Hooks\Storage\FrameRecord;
use App\Domain\Hooks\Storage\FrameRecords;
use App\Domain\Hooks\Storage\InvalidBottomState;
use App\Domain\Tasks\TaskWorkState;
use Illuminate\Events\Dispatcher;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Fixtures\Hooks\InMemoryTaskType;

final class StackRestorerTest extends TestCase
{
    private InMemoryTaskType $tasks;

    private StackRestorer $restorer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->tasks = new InMemoryTaskType([42 => TaskWorkState::Active, 43 => TaskWorkState::Active]);
        $this->restorer = $this->restorerWith($this->tasks);
    }

    public function test_a_stored_stack_comes_back_with_its_frames_in_order(): void
    {
        $stack = $this->restorer->restore($this->records($this->bottom(), $this->task('task-42', 42)), ReadyStateType::MainAgent);

        $this->assertSame(['ready', 'task-42'], $stack->frameIds());
        $this->assertSame(AnswerKind::PreventStop, $stack->answer(HookInputs::all()['stop'])->decision->answerKind());
    }

    public function test_each_restore_reads_the_subjects_fresh(): void
    {
        $records = $this->records($this->bottom(), $this->task('task-42', 42));

        $before = $this->restorer->restore($records, ReadyStateType::MainAgent);
        $this->tasks->tasks[42] = TaskWorkState::Finished;
        $after = $this->restorer->restore($records, ReadyStateType::MainAgent);

        $this->assertSame(['ready', 'task-42'], $before->frameIds());
        $this->assertSame(['ready'], $after->frameIds());
    }

    public function test_a_finished_frame_is_removed_from_the_middle(): void
    {
        $this->tasks->tasks[42] = TaskWorkState::Cancelled;

        $stack = $this->restorer->restore(
            $this->records($this->bottom(), $this->task('task-42', 42), $this->task('task-43', 43)),
            ReadyStateType::MainAgent,
        );

        $this->assertSame(['ready', 'task-43'], $stack->frameIds());
    }

    public function test_the_bottom_state_follows_the_agent_role(): void
    {
        $helper = $this->restorer->restore($this->records($this->bottom('hooks.read_only_helper_ready')), ReadyStateType::ReadOnlyHelper);

        $edit = HookInputs::all()['file edit'];

        $this->assertSame(AnswerKind::Deny, $helper->answer($edit)->decision->answerKind());
    }

    public function test_a_stack_without_a_bottom_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restorer->restore($this->records($this->task('task-42', 42)), ReadyStateType::MainAgent);
    }

    public function test_an_empty_stack_is_refused(): void
    {
        $this->expectException(InvalidBottomState::class);

        $this->restorer->restore($this->records(), ReadyStateType::MainAgent);
    }

    public function test_a_second_bottom_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::repeated('ready-2'));

        $this->restorer->restore($this->records($this->bottom(), $this->bottom(id: 'ready-2')), ReadyStateType::MainAgent);
    }

    public function test_a_bottom_of_another_role_is_refused(): void
    {
        $this->expectExceptionObject(InvalidBottomState::ofAnotherRole('hooks.main_ready', ReadyStateType::ReadOnlyHelper));

        $this->restorer->restore($this->records($this->bottom()), ReadyStateType::ReadOnlyHelper);
    }

    public function test_an_unknown_state_type_is_an_error(): void
    {
        $this->expectException(StateTypeUnknown::class);

        $this->restorer->restore(
            $this->records($this->bottom(), new FrameRecord('note-1', new StateReference('notes.reading', NoSubject::None), false, 1)),
            ReadyStateType::MainAgent,
        );
    }

    public function test_a_frame_stored_in_an_unknown_version_is_an_error(): void
    {
        $restorer = $this->restorerWith(new InMemoryTaskType([42 => TaskWorkState::Active], version: 2));

        $this->expectException(StateSchemaUnknown::class);

        $restorer->restore($this->records($this->bottom(), $this->task('task-42', 42)), ReadyStateType::MainAgent);
    }

    public function test_a_missing_subject_is_an_error_and_not_a_finished_frame(): void
    {
        $this->expectException(StateSubjectMissing::class);

        $this->restorer->restore($this->records($this->bottom(), $this->task('task-99', 99)), ReadyStateType::MainAgent);
    }

    private function restorerWith(InMemoryTaskType $tasks): StackRestorer
    {
        $events = new Dispatcher;
        $events->listen(StateTypesRequested::class, fn (StateTypesRequested $event) => $event->registry->register('tasks.working', $tasks));
        $types = new StateTypes($events);

        return new StackRestorer($types, new RegisteredStateFactory($types));
    }

    private function records(FrameRecord ...$records): FrameRecords
    {
        return new FrameRecords(array_values($records));
    }

    private function bottom(string $typeKey = 'hooks.main_ready', string $id = 'ready'): FrameRecord
    {
        return new FrameRecord($id, new StateReference($typeKey, NoSubject::None), true, 1);
    }

    private function task(string $id, int $number): FrameRecord
    {
        return new FrameRecord($id, new StateReference('tasks.working', new SubjectReference($number, 1)), false, 1);
    }
}
