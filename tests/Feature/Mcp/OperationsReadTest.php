<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Commands\AssignRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\RequestKey;
use Domain\Tasks\Models\Task;
use Illuminate\Database\ConnectionInterface;
use stdClass;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Mcp\CascadeResult;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * operations_read and journal://v1/operations/{request_key}: the caller's write under a key, with its outcomes page
 * by page, read again for the calling session each time.
 */
final class OperationsReadTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use StartsAgentRequests;

    private const array TABLES = ['agents', 'agent_sessions', 'launch_credentials', 'tasks', 'assignments', 'agent_stacks', 'command_receipts'];

    private const string KEY = '01JD8X0G9M3QZ6V4K2OPERATN1';

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->launch = TestLaunch::start();
    }

    public function test_a_completed_assignment_write_reads_back_with_its_outcome(): void
    {
        $task = Task::factory()->create(['title' => 'Keyed']);
        $this->startRequestAs($this->launch->agent->id, $this->launch->session->id);
        $this->app->make(RequestKey::class)->set(self::KEY);
        $this->app->make(CommandBus::class)->run(new AssignRecord($task->assignmentIdentity(), ActorIdentity::of($this->launch->agent)));

        $result = $this->callMcpTool($this->launch, 'operations_read', ['request_key' => self::KEY])->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->assertSame('completed', $result['state']);
        $this->assertSame('AssignRecord', $result['command']);
        $this->assertSame(1, $result['outcome_count']);
        $this->assertSame([], $result['next_actions']);
    }

    public function test_a_1000_outcome_cascade_is_read_whole_by_following_continuations(): void
    {
        $this->receipt($this->launch->session->id, new CascadeResult('plans.plan 1', array_map(fn (int $number): array => ['record' => "tasks.task {$number}", 'changed' => true], range(1, 1000))));

        $records = [];
        $arguments = ['request_key' => self::KEY];

        do {
            $page = $this->callMcpTool($this->launch, 'operations_read', $arguments)->assertJsonPath('result.isError', false)->json('result.structuredContent');
            $records = [...$records, ...array_column($page['outcomes'], 'record')];
            $arguments = $page['next_actions'][0]['arguments'] ?? null;
        } while ($arguments !== null);

        $this->assertCount(1000, $records);
        $this->assertSame(array_unique($records), $records);
        $this->assertSame(1, $this->app->make(ConnectionInterface::class)->table('command_receipts')->count());
    }

    public function test_the_resource_reads_the_same_with_its_continuation_in_the_uri(): void
    {
        $this->receipt($this->launch->session->id, new CascadeResult('plans.plan 1', array_map(fn (int $number): array => ['record' => "tasks.task {$number}", 'changed' => true], range(1, 30))));
        $tool = $this->callMcpTool($this->launch, 'operations_read', ['request_key' => self::KEY])->json('result.structuredContent');
        $continuation = $tool['next_actions'][0]['arguments']['continuation'];

        $resource = $this->sendMcp($this->launch, 'resources/read', ['uri' => 'journal://v1/operations/'.self::KEY.'?continuation='.urlencode($continuation)])->assertOk()->json('result.contents.0');

        $this->assertSame(20, json_decode($resource['text'], true)['outcome_offset']);
        $this->assertCount(10, json_decode($resource['text'], true)['outcomes']);
    }

    public function test_another_sessions_key_answers_as_unknown(): void
    {
        $other = TestLaunch::start();
        $this->receipt($other->session->id, new CascadeResult('plans.plan 1', []));

        $this->callMcpTool($this->launch, 'operations_read', ['request_key' => self::KEY])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.state', 'unknown');
    }

    private function receipt(string $sessionId, CascadeResult $result): void
    {
        CommandReceipt::take($sessionId, self::KEY, new stdClass(), ActorContext::forAgent($this->launch->agent->id))->complete($result);
    }
}
