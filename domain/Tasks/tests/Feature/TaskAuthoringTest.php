<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskLimits;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * A task carries its brief, creator, revision and run, and changes them only through its own intention methods,
 * within Tasks' text limits.
 */
final class TaskAuthoringTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['tasks'];

    private const string SESSION = '01jd8x0g9m3qz6v4k2session1';

    public function test_the_tasks_table_has_the_authoring_and_run_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('tasks', ['brief', 'creator_type', 'creator_id', 'creator_session_id', 'revision', 'run_number', 'run_session_id', 'result_note', 'block_reason', 'cancel_reason']));
    }

    public function test_create_task_records_its_brief_and_creator(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));

        $task = Task::query()->findOrFail($this->app->make(CommandBus::class)->run(new CreateTask('Write the brief', 'What it asks.')));

        $this->assertSame(['Write the brief', 'What it asks.', 1], [$task->title, $task->brief, $task->revision]);
        $this->assertSame([ActorType::User, TestIds::of(7), null], [$task->creator_type, $task->creator_id, $task->creator_session_id]);
    }

    public function test_describe_changes_only_title_brief_and_revision(): void
    {
        $task = Task::factory()->create(['title' => 'Old', 'brief' => 'Old brief']);

        $task->describe('New', 'New brief');

        $fresh = $task->fresh();
        $this->assertSame(['New', 'New brief', 2, TaskState::Open, 0], [$fresh?->title, $fresh?->brief, $fresh?->revision, $fresh?->state, $fresh?->run_number]);
    }

    public function test_a_run_belongs_to_the_session_that_started_it_and_records_its_note_and_reasons(): void
    {
        $task = Task::factory()->create();

        $task->startRun(self::SESSION);
        $this->assertSame([1, TaskState::Started], [$task->run_number, $task->state]);
        $this->assertTrue($task->isRunOwnedBy(self::SESSION));
        $this->assertFalse($task->isRunOwnedBy('01jd8x0g9m3qz6v4k2session2'));

        $task->blockRun('Waits on the schema.');
        $task->startRun(self::SESSION);
        $task->finishRun('Built and tested.');
        $fresh = $task->fresh();

        $this->assertSame([2, TaskState::Finished, 'Waits on the schema.', 'Built and tested.', 1], [$fresh?->run_number, $fresh?->state, $fresh?->block_reason, $fresh?->result_note, $fresh?->revision]);
    }

    public function test_cancel_records_its_reason(): void
    {
        $task = Task::factory()->create();

        $task->cancelWith('No longer needed.');

        $this->assertSame([TaskState::Cancelled, 'No longer needed.'], [$task->fresh()?->state, $task->fresh()?->cancel_reason]);
    }

    public function test_the_limits_refuse_a_241_character_title_and_an_8001_character_note(): void
    {
        $task = Task::factory()->create();

        $this->assertThrows(fn () => $task->describe(str_repeat('é', TaskLimits::TITLE_CHARACTERS + 1), 'Brief'), TaskTextTooLong::class);
        $this->assertThrows(fn () => $task->finishRun(str_repeat('a', TaskLimits::NOTE_CHARACTERS + 1)), TaskTextTooLong::class);
        $task->describe(str_repeat('é', TaskLimits::TITLE_CHARACTERS), 'Brief');
        $this->assertSame(2, $task->fresh()?->revision);
    }
}
