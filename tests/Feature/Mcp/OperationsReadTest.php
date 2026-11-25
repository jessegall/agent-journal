<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Bus\CommandBus;
use App\Models\CommandRules\CommandReceipt;
use App\Support\ActorContext;
use App\Support\AssigneeIdentity;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use App\Support\RequestKey;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\ConnectionInterface;
use stdClass;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Mcp\CascadeResult;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * operations_read and journal://v1/operations/{request_key}: the caller's write under a key, with its outcomes page
 * by page, read again for the calling session each time.
 */
final class OperationsReadTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private TestStart $start;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'assignments',
        'agent_stacks',
        'command_receipts',
    ];

    private const string KEY = '01JD8X0G9M3QZ6V4K2OPERATN1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Test agent')->startSession('Test agent', 'Test agent');
        $this->start = $this->journal->testStartCalled('Test agent');
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_completed_assignment_write_reads_back_with_its_outcome(): void
    {
        $task = Task::factory()->create(['title' => 'Keyed']);
        $this->journal->actAsAgentIds($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set(self::KEY);
        $this->app->make(CommandBus::class)->run(
            new AssignRecordCommand($task->assignmentIdentity(), AssigneeIdentity::of($this->start->agent)),
        );

        $result = $this->callMcpTool(
            $this->start,
            'operations_read',
            ['request_key' => self::KEY],
        )->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->assertSame('completed', $result['state']);
        $this->assertSame('AssignRecord', $result['command']);
        $this->assertSame(1, $result['outcome_count']);
        $this->assertSame([], $result['next_actions']);
    }

    #[TimeLimit(3, 'It writes a thousand command outcomes and follows every continuation page over them.')]
    public function test_a_1000_outcome_cascade_is_read_whole_by_following_continuations(): void
    {
        $this->receipt(
            $this->start->session->id,
            new CascadeResult(
                'plans.plan 1',
                array_map(fn (int $number) => ['record' => "tasks.task {$number}", 'changed' => true], range(1, 1000)),
            ),
        );

        $records = [];
        $arguments = ['request_key' => self::KEY];

        do {
            $page = $this->callMcpTool(
                $this->start,
                'operations_read',
                $arguments,
            )->assertJsonPath('result.isError', false)->json('result.structuredContent');
            $records = [...$records, ...array_column($page['outcomes'], 'record')];
            $arguments = $page['next_actions'][0]['arguments'] ?? null;
        } while ($arguments !== null);

        $this->assertCount(1000, $records);
        $this->assertSame(array_unique($records), $records);
        $this->assertSame(1, $this->app->make(ConnectionInterface::class)->table('command_receipts')->count());
    }

    public function test_the_resource_reads_the_same_with_its_continuation_in_the_uri(): void
    {
        $this->receipt(
            $this->start->session->id,
            new CascadeResult(
                'plans.plan 1',
                array_map(fn (int $number) => ['record' => "tasks.task {$number}", 'changed' => true], range(1, 30)),
            ),
        );
        $tool = $this->callMcpTool(
            $this->start,
            'operations_read',
            ['request_key' => self::KEY],
        )->json('result.structuredContent');
        $continuation = $tool['next_actions'][0]['arguments']['continuation'];

        $resource = $this->sendMcp(
            $this->start,
            'resources/read',
            ['uri' => 'journal://v1/operations/'.self::KEY.'?continuation='.urlencode($continuation)],
        )->assertOk()->json('result.contents.0');

        $this->assertSame(20, json_decode($resource['text'], true)['outcome_offset']);
        $this->assertCount(10, json_decode($resource['text'], true)['outcomes']);
    }

    public function test_another_sessions_key_answers_as_unknown(): void
    {
        $other = TestStart::start();
        $this->receipt($other->session->id, new CascadeResult('plans.plan 1', []));

        $this->callMcpTool($this->start, 'operations_read', ['request_key' => self::KEY])
            ->assertJsonPath('result.isError', false)
            ->assertJsonPath('result.structuredContent.state', 'unknown');
    }

    private function receipt(string $sessionId, CascadeResult $result): void
    {
        CommandReceipt::create(
            ReceiptCaller::inSession(ActorContext::forAgent($this->start->agent->id), $sessionId),
            self::KEY,
            new stdClass(),
            ReceiptRetention::standard(),
        )->complete($result);
    }
}
