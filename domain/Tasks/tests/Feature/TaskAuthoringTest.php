<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandInputInvalid;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Commands\EditTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TestIds;

/**
 * A task carries its brief, creator, revision and run, and changes them only through its own intention methods,
 * within Tasks' text limits.
 */
final class TaskAuthoringTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = ['tasks', 'agents', 'agent_sessions', 'launch_credentials', 'agent_stacks'];

    private const string AGENT = '01jd8x0g9m3qz6v4k2agent001';

    public function test_the_tasks_table_has_the_authoring_and_run_columns(): void
    {
        $this->assertTrue(Schema::hasColumns('tasks', [
            'brief',
            'creator_type',
            'creator_id',
            'revision',
            'run_number',
            'result_note',
            'block_reason',
            'cancel_reason',
        ]));
    }

    public function test_create_task_records_its_brief_and_creator(): void
    {
        $this->actAsUser();

        $taskId = $this->app->make(CommandBus::class)->run(new CreateTask('Write the brief', 'What it asks.'));
        $task = Task::query()->findOrFail($taskId);

        $this->assertSame(['Write the brief', 'What it asks.', 1], [$task->title, $task->brief, $task->revision]);
        $this->assertSame([ActorType::User, TestIds::of(7)], [$task->creator_type, $task->creator_id]);
    }

    public function test_describe_changes_only_title_brief_and_revision(): void
    {
        $task = Task::factory()->create(['title' => 'Old', 'brief' => 'Old brief']);

        $task->describe('New', 'New brief');

        $fresh = $task->fresh();
        $this->assertSame(
            ['New', 'New brief', 2, TaskState::Open, 0],
            [$fresh?->title, $fresh?->brief, $fresh?->revision, $fresh?->state, $fresh?->run_number],
        );
    }

    public function test_a_run_counts_up_and_records_its_note_and_reasons(): void
    {
        $task = Task::factory()->create();

        $task->startRun();
        $this->assertSame([1, TaskState::Started], [$task->run_number, $task->state]);

        $task->blockRun('Waits on the schema.');
        $task->startRun();
        $task->finishRun('Built and tested.');
        $fresh = $task->fresh();

        $this->assertSame(
            [2, TaskState::Finished, 'Waits on the schema.', 'Built and tested.', 1],
            [$fresh?->run_number, $fresh?->state, $fresh?->block_reason, $fresh?->result_note, $fresh?->revision],
        );
    }

    public function test_cancel_records_its_reason(): void
    {
        $task = Task::factory()->create();

        $task->cancelWith('No longer needed.');

        $this->assertSame(
            [TaskState::Cancelled, 'No longer needed.'],
            [$task->fresh()?->state, $task->fresh()?->cancel_reason],
        );
    }

    public function test_a_241_character_title_is_refused_before_a_task_is_made_and_240_pass(): void
    {
        $this->actAsUser();
        $bus = $this->app->make(CommandBus::class);
        $tooLong = new CreateTask(str_repeat('é', Task::TITLE_CHARACTERS + 1), 'Brief');

        $this->assertThrows(
            fn () => $bus->run($tooLong),
            CommandInputInvalid::class,
            'title: The title field must not be greater than 240 characters.',
        );
        $this->assertSame(0, Task::query()->count());

        $taskId = $bus->run(new CreateTask(str_repeat('é', Task::TITLE_CHARACTERS), 'Brief'));

        $this->assertSame(Task::TITLE_CHARACTERS, mb_strlen((string) Task::query()->findOrFail($taskId)->title));
    }

    public function test_an_edit_with_neither_title_nor_brief_is_refused_naming_the_title(): void
    {
        $this->actAsUser();
        $task = Task::factory()->create(['title' => 'First', 'brief' => 'First brief']);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new EditTask($task->id, 1)),
            CommandInputInvalid::class,
            'title: The title field is required when brief is not present.',
        );
        $this->assertSame(1, $task->fresh()?->revision);
    }

    public function test_an_agent_creates_one_open_task_as_itself_and_its_session(): void
    {
        $launch = TestLaunch::start();

        $taskId = $this->signed($launch, '/agent/tasks/create', [
            'title' => 'From the agent',
            'brief' => 'What it asks.',
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertOk()->json('task_id');

        $task = Task::query()->findOrFail($taskId);
        $this->assertSame(
            [ActorType::Agent, $launch->agent->id, TaskState::Open],
            [$task->creator_type, $task->creator_id, $task->state],
        );
        $this->assertSame(1, Task::query()->count());
    }

    public function test_a_stale_revision_is_a_conflict_and_the_newer_text_stays(): void
    {
        $launch = TestLaunch::start();
        $task = Task::factory()->create(['title' => 'First', 'brief' => 'First brief']);
        $task->describe('Second', 'Second brief');

        $this->signed($launch, '/agent/tasks/edit', [
            'task_id' => $task->id,
            'expected_revision' => 1,
            'title' => 'Stale',
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertConflict();

        $this->assertSame(['Second', 2], [$task->fresh()?->title, $task->fresh()?->revision]);
    }

    public function test_the_agent_route_and_the_bus_give_the_same_edit(): void
    {
        $launch = TestLaunch::start();
        $task = Task::factory()->create(['title' => 'First', 'brief' => 'First brief']);

        $this->signed($launch, '/agent/tasks/edit', [
            'task_id' => $task->id,
            'expected_revision' => 1,
            'brief' => 'Route brief',
            'request_key' => bin2hex(random_bytes(8)),
        ])->assertOk()->assertJson(['task_id' => $task->id, 'revision' => 2]);
        $this->actAsUser();
        $revision = $this->app->make(CommandBus::class)->run(new EditTask($task->id, 2, brief: 'Bus brief'));

        $this->assertSame(3, $revision);
        $this->assertSame(['First', 'Bus brief'], [$task->fresh()?->title, $task->fresh()?->brief]);
        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(new EditTask($task->id, 2, title: 'Late')),
            TaskRevisionChanged::class,
        );
    }

    private function actAsUser(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(7)),
            new OwnerAuthority('test'),
        );
    }
}
