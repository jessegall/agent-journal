<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The ordinary search tool runs over the declared sources: words alone, within tasks.task, discovery and a
 * continuation.
 */
#[TimeLimit(5, 'Each case sends several signed MCP calls.')]
final class DeclaredSearchToolTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedPayloads;

    private const array TABLES = [
        'users', 'tasks', 'agents', 'agent_sessions', 'session_tokens', 'agent_stacks', 'hook_calls', 'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

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
        $sources = $this->callMcpTool($this->caller, 'search', ['discover' => true, 'prefix' => 'ta'])
            ->assertJsonPath('result.isError', false)
            ->json('result.structuredContent.sources');

        $this->assertContains('tasks.task', array_column($sources, 'key'));
        $this->assertContains('tasks.log', array_column($sources, 'key'));
    }

    public function test_a_continuation_returns_the_next_hit(): void
    {
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
}
