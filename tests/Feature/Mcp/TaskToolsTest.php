<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Models\TaskLogEntry;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(5, 'The task flowsOutsideMcp cross several signed requests and inspect persisted outcomes.')]
final class TaskToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const string EDITED_TITLE = 'Edited title';

    private const string CANCEL_REASON = 'Work was superseded.';

    private const string BLOCK_REASON = 'Needs a decision.';

    private const array TABLES = [
        'users', 'tasks', 'task_runs', 'task_log_entries', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks',
        'hook_calls', 'links', 'assignments', 'claim_authorizations', 'command_receipts',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
    }

    public function test_create_and_edit_share_the_signed_route_receipts_and_list_the_edited_task(): void
    {
        $create = ['title' => 'First title', 'brief' => 'Read this.', 'request_key' => 'make-task'];
        $id = $this->callMcpTool($this->caller, 'tasks_create', $create)
            ->assertJsonPath('result.isError', false)->json('result.structuredContent.task_id');
        $this->signed($this->caller, '/agent/tasks/create', $create)->assertOk()->assertJsonPath('task_id', $id);

        $edit = [
            'task_id' => $id,
            'expected_revision' => 1,
            'title' => 'Edited title',
            'brief' => 'New context.',
            'request_key' => 'edit-task',
        ];
        $this->signed($this->caller, '/agent/tasks/edit', $edit)->assertOk()->assertJsonPath('revision', 2);
        $this->callMcpTool($this->caller, 'tasks_edit', $edit)
            ->assertJsonPath('result.isError', false)->assertJsonPath('result.structuredContent.revision', 2);

        $this->callMcpTool($this->caller, 'tasks_list', ['search' => 'Edited', 'per_page' => 1])
            ->assertJsonPath('result.structuredContent.total', 1)
            ->assertJsonPath('result.structuredContent.cards.0.id', $id)
            ->assertJsonPath('result.structuredContent.cards.0.title', self::EDITED_TITLE);
    }

    public function test_start_conflict_offers_the_task_reader_and_finish_uses_the_current_run(): void
    {
        $task = Task::factory()->create();
        $other = TestStart::start();
        $run = $this->start($task);

        $this->callMcpTool($other, 'tasks_start', ['task_id' => $task->id, 'request_key' => 'other-start'])
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'conflict')
            ->assertJsonPath('result.structuredContent.next_action.tool', 'tasks_read')
            ->assertJsonPath('result.structuredContent.next_action.arguments.task_id', $task->id);

        $this->callMcpTool($this->caller, 'tasks_finish', [
            'task_id' => $task->id,
            'run_number' => $run,
            'note' => 'Complete.',
            'request_key' => 'finish-task',
        ])->assertJsonPath('result.structuredContent.state', 'finished');

        $this->callMcpTool($this->caller, 'tasks_read', ['task_id' => $task->id, 'view' => 'context'])
            ->assertJsonPath('result.structuredContent.state', 'finished')
            ->assertJsonPath('result.structuredContent.result_note', 'Complete.');
    }

    public function test_block_and_cancel_preserve_the_reasons_in_the_task_details(): void
    {
        $task = Task::factory()->create();
        $run = $this->start($task);

        $this->callMcpTool($this->caller, 'tasks_block', [
            'task_id' => $task->id,
            'run_number' => $run,
            'reason' => 'Needs a decision.',
            'request_key' => 'block-task',
        ])->assertJsonPath('result.structuredContent.state', 'blocked');
        $this->callMcpTool($this->caller, 'tasks_cancel', [
            'task_id' => $task->id,
            'reason' => 'Work was superseded.',
            'request_key' => 'cancel-task',
        ])->assertJsonPath('result.structuredContent.state', 'cancelled');

        $this->callMcpTool($this->caller, 'tasks_read', ['task_id' => $task->id, 'view' => 'context'])
            ->assertJsonPath('result.structuredContent.block_reason', self::BLOCK_REASON)
            ->assertJsonPath('result.structuredContent.cancel_reason', self::CANCEL_REASON);
    }

    public function test_a_worker_logs_twice_in_its_run_and_a_caller_without_that_run_is_refused(): void
    {
        $task = Task::factory()->create();
        $run = $this->start($task);

        foreach (['Read the schema.', 'Wrote the migration.'] as $offset => $text) {
            $this->callMcpTool($this->caller, 'tasks_log', [
                'task_id' => $task->id,
                'run_number' => $run,
                'text' => $text,
                'request_key' => "log-{$offset}",
            ])->assertJsonPath('result.isError', false);
        }

        $this->assertSame(
            [[$run, 'Read the schema.', 1], [$run, 'Wrote the migration.', 2]],
            array_map(
                fn (TaskLogEntry $entry) => [$entry->run_number, $entry->text, $entry->sequence],
                TaskLogEntry::query()->where('task_id', $task->id)->orderBy('sequence')->get()->all(),
            ),
        );

        $this->callMcpTool($this->caller, 'tasks_log', [
            'task_id' => $task->id,
            'run_number' => $run + 1,
            'text' => 'Not my run.',
            'request_key' => 'log-other-run',
        ])->assertJsonPath('result.isError', true);
        $this->assertSame(2, TaskLogEntry::query()->where('task_id', $task->id)->count());
    }

    public function test_the_resource_and_tool_return_the_same_context_and_continuation_page(): void
    {
        $brief = str_repeat('é', 1600);
        $task = Task::factory()->create(['brief' => $brief]);
        $uri = "journal://v1/tasks/{$task->id}";
        $summary = $this->callMcpTool($this->caller, 'tasks_read', ['task_id' => $task->id])
            ->assertJsonPath('result.isError', false)->json('result.structuredContent');
        $this->assertSame($summary, $this->resource($uri));

        $first = $this->callMcpTool(
            $this->caller,
            'tasks_read',
            ['task_id' => $task->id, 'view' => 'context'],
        )->assertJsonPath('result.isError', false)->json('result.structuredContent');
        $resource = $this->resource($uri.'?view=context');
        $this->assertSame($first['brief'], $resource['brief']);
        $this->assertSame($first['revision'], $resource['revision']);

        $repeated = $this->resource($uri.'?continuation='.urlencode(
            $first['next_actions'][0]['arguments']['continuation'],
        ));
        $this->assertSame(450, $repeated['character_offset']);
        $this->assertSame(str_repeat('é', 450), $repeated['brief']);
    }

    private function start(Task $task): int
    {
        $this->caller->openStack($this->app);
        $response = $this->callMcpTool(
            $this->caller,
            'tasks_start',
            ['task_id' => $task->id, 'request_key' => 'start-task'],
        );
        $this->assertFalse($response->json('result.isError'), $response->getContent());

        return $response->json('result.structuredContent.run_number');
    }

    /**
     * @return array<string, mixed>
     */
    private function resource(string $uri): array
    {
        return json_decode(
            $this->sendMcp($this->caller, 'resources/read', ['uri' => $uri])->assertOk()
                ->json('result.contents.0.text'),
            true,
            flags: JSON_THROW_ON_ERROR,
        );
    }
}
