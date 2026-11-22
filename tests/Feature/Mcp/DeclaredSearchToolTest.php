<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * With the integration setting on, the ordinary search tool runs over the declared sources: words alone, within
 * tasks.task, discovery and a continuation; with it off, the same words get today's answer unchanged.
 */
#[TimeLimit(5, 'Each case sends several signed MCP calls.')]
final class DeclaredSearchToolTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const array TABLES = [
        'users', 'tasks', 'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls', 'command_receipts',
    ];

    private TestStart $caller;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
    }

    public function test_words_alone_and_within_tasks_find_the_task_with_its_open_action(): void
    {
        config(['search.declared' => true]);
        $task = Task::factory()->create(['title' => 'Driver handbook']);

        foreach ([['query' => 'driver'], ['query' => 'driver', 'within' => 'tasks.task']] as $arguments) {
            $this->callMcpTool($this->caller, 'search', $arguments)
                ->assertJsonPath('result.isError', false)
                ->assertJsonPath('result.structuredContent.hits.0.searchable', 'tasks.task')
                ->assertJsonPath('result.structuredContent.hits.0.reference.id', $task->id)
                ->assertJsonPath('result.structuredContent.hits.0.open.tool', 'tasks_read')
                ->assertJsonPath('result.structuredContent.hits.0.open.arguments.task_id', $task->id);
        }
    }

    public function test_discovery_lists_tasks_by_prefix(): void
    {
        config(['search.declared' => true]);

        $this->callMcpTool($this->caller, 'search', ['discover' => true, 'prefix' => 'ta'])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.sources.0.display', 'Tasks (tasks.task)');
    }

    public function test_a_continuation_returns_the_next_hit(): void
    {
        config(['search.declared' => true]);
        $first = Task::factory()->create(['id' => '01arz3ndektsv4rrffq69g0001', 'title' => 'Driver']);
        $second = Task::factory()->create(['id' => '01arz3ndektsv4rrffq69g0002', 'title' => 'Driver']);

        $arguments = ['query' => 'driver', 'within' => 'tasks.task', 'limit' => 1];
        $page = $this->callMcpTool($this->caller, 'search', $arguments)
            ->assertJsonPath('result.structuredContent.hits.0.reference.id', $first->id);
        $continuation = $page->json('result.structuredContent.next_actions.0.arguments.continuation');

        $this->assertIsString($continuation);
        $this->callMcpTool($this->caller, 'search', ['continuation' => $continuation])
            ->assertJsonPath('result.structuredContent.hits.0.reference.id', $second->id);
    }

    public function test_with_the_setting_off_the_release_answer_is_unchanged(): void
    {
        config(['search.declared' => false]);
        Task::factory()->create(['title' => 'Driver handbook']);

        $this->callMcpTool($this->caller, 'search', ['query' => 'driver'])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.hits.0.type', 'tasks.task')
            ->assertJsonStructure(['result' => ['structuredContent' => ['unavailable_types', 'types_with_more']]]);
    }
}
