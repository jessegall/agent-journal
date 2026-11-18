<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use Domain\Tasks\Commands\CreateTask;
use Domain\Tasks\Commands\EditTask;
use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Exceptions\TaskRevisionChanged;
use Domain\Tasks\Exceptions\TaskTextTooLong;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskLimits;
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
        $this->assertTrue(Schema::hasColumns('tasks', ['brief', 'creator_type', 'creator_id', 'revision', 'run_number', 'run_actor_type', 'run_actor_id', 'result_note', 'block_reason', 'cancel_reason']));
    }

    public function test_create_task_records_its_brief_and_creator(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));

        $task = Task::query()->findOrFail($this->app->make(CommandBus::class)->run(new CreateTask('Write the brief', 'What it asks.')));

        $this->assertSame(['Write the brief', 'What it asks.', 1], [$task->title, $task->brief, $task->revision]);
        $this->assertSame([ActorType::User, TestIds::of(7)], [$task->creator_type, $task->creator_id]);
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

        $task->startRun(new ActorIdentity(ActorType::Agent, self::AGENT));
        $this->assertSame([1, TaskState::Started], [$task->run_number, $task->state]);
        $this->assertTrue($task->isRunOwnedBy(new ActorIdentity(ActorType::Agent, self::AGENT)));
        $this->assertFalse($task->isRunOwnedBy(new ActorIdentity(ActorType::Agent, '01jd8x0g9m3qz6v4k2agent002')));

        $task->blockRun('Waits on the schema.');
        $task->startRun(new ActorIdentity(ActorType::Agent, self::AGENT));
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

    public function test_an_agent_creates_one_open_task_as_itself_and_its_session(): void
    {
        $launch = TestLaunch::start();

        $taskId = $this->signed($launch, '/agent/tasks/create', ['title' => 'From the agent', 'brief' => 'What it asks.'])->assertCreated()->json('taskId');

        $task = Task::query()->findOrFail($taskId);
        $this->assertSame([ActorType::Agent, $launch->agent->id, TaskState::Open], [$task->creator_type, $task->creator_id, $task->state]);
        $this->assertSame(1, Task::query()->count());
    }

    public function test_a_stale_revision_is_a_conflict_and_the_newer_text_stays(): void
    {
        $launch = TestLaunch::start();
        $task = Task::factory()->create(['title' => 'First', 'brief' => 'First brief']);
        $task->describe('Second', 'Second brief');

        $this->signed($launch, '/agent/tasks/edit', ['taskId' => $task->id, 'expectedRevision' => 1, 'title' => 'Stale'])->assertConflict();

        $this->assertSame(['Second', 2], [$task->fresh()?->title, $task->fresh()?->revision]);
    }

    public function test_the_agent_route_and_the_bus_give_the_same_edit(): void
    {
        $launch = TestLaunch::start();
        $task = Task::factory()->create(['title' => 'First', 'brief' => 'First brief']);

        $this->signed($launch, '/agent/tasks/edit', ['taskId' => $task->id, 'expectedRevision' => 1, 'brief' => 'Route brief'])->assertOk()->assertJson(['taskId' => $task->id, 'revision' => 2]);
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(7)));
        $revision = $this->app->make(CommandBus::class)->run(new EditTask($task->id, 2, brief: 'Bus brief'));

        $this->assertSame(3, $revision);
        $this->assertSame(['First', 'Bus brief'], [$task->fresh()?->title, $task->fresh()?->brief]);
        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run(new EditTask($task->id, 2, title: 'Late')), TaskRevisionChanged::class);
    }
}
