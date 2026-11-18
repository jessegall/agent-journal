<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\Page;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Mockery;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\AssignmentWriterInTransaction;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * assignments_read and assignees_list read through Core's assignment readers, never by a page number.
 */
final class AssignmentReadToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use StartsAgentRequests;

    private const array TABLES = ['users', 'agents', 'agent_sessions', 'launch_credentials', 'tasks', 'assignments', 'agent_stacks'];

    private TestLaunch $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestLaunch::start();
        $this->startUserRequestAs($owner->id);
    }

    public function test_assignments_read_on_a_held_task_returns_the_reference_the_show_command_prints(): void
    {
        $task = Task::query()->create(['title' => 'Write the tool']);
        $held = $this->app->make(AssignmentWriterInTransaction::class)->assign($task->assignmentIdentity(), ActorIdentity::of($this->caller->agent))->outcomes[0]->current;

        $result = $this->callMcpTool($this->caller, 'assignments_read', ['record_type' => 'tasks.task', 'record_id' => $task->id])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent');

        $this->assertSame($held->reference->id, $result['holder']['reference']);
        $this->assertSame(['agent', $this->caller->agent->id], [$result['holder']['type'], $result['holder']['id']]);
    }

    public function test_an_unheld_task_has_no_holder(): void
    {
        $task = Task::query()->create(['title' => 'Nobody holds this']);

        $this->callMcpTool($this->caller, 'assignments_read', ['record_type' => 'tasks.task', 'record_id' => $task->id])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.holder', null);
    }

    public function test_an_absent_record_and_an_unregistered_type_answer_record_unavailable(): void
    {
        foreach (['tasks.task', 'nothing.here'] as $type) {
            $this->callMcpTool($this->caller, 'assignments_read', ['record_type' => $type, 'record_id' => (string) Str::ulid()])
                ->assertJsonPath('result.isError', true)
                ->assertJsonPath('result.structuredContent.code', 'record_unavailable');
        }
    }

    public function test_assignees_list_maps_after_id_and_limit_to_a_page_and_continues_by_cursor(): void
    {
        $afterId = (string) Str::ulid();
        $nextAfterId = (string) Str::ulid();
        $reader = Mockery::mock(AssigneeReader::class);
        $reader->shouldReceive('eligible')->once()
            ->withArgs(fn (ActorType $type, Page $page): bool => $type === ActorType::Agent && $page->afterId === $afterId && $page->limit === 20)
            ->andReturn(new AssigneeList([new AssigneeName(new ActorIdentity(ActorType::Agent, $nextAfterId), 'Worker')], $nextAfterId));
        $reader->shouldReceive('eligible')->once()
            ->withArgs(fn (ActorType $type, Page $page): bool => $type === ActorType::Agent && $page->afterId === $nextAfterId && $page->limit === 20)
            ->andReturn(new AssigneeList([], null));
        $this->app->instance(AssigneeReader::class, $reader);

        $first = $this->callMcpTool($this->caller, 'assignees_list', ['type' => 'agent', 'after_id' => $afterId, 'limit' => 20])->json('result.structuredContent');
        $this->assertSame([['type' => 'agent', 'id' => $nextAfterId, 'name' => 'Worker']], $first['assignees']);
        $this->assertSame(['type', 'continuation'], array_keys($first['next_actions'][0]['arguments']));

        $last = $this->callMcpTool($this->caller, 'assignees_list', $first['next_actions'][0]['arguments'])->json('result.structuredContent');
        $this->assertSame([], $last['assignees']);
        $this->assertSame([], $last['next_actions']);
    }

    public function test_a_page_argument_is_invalid_input(): void
    {
        $this->callMcpTool($this->caller, 'assignees_list', ['type' => 'agent', 'page' => 2])
            ->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'invalid_input');
    }
}
