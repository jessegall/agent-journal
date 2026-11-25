<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Bus\CommandBus;
use App\Support\AssigneeIdentity;
use App\Support\RequestKey;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * operations_read and journal://v1/operations/{request_key}: the caller's write under a key, with its outcomes page
 * by page, read again for the calling session each time.
 */
final class OperationsReadTest extends TestCase
{
    use CommitsHookRows;

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

        $result = $this->journal->mcpTool(
            $this->start,
            'operations_read',
            ['request_key' => self::KEY],
        )->assertOk()->assertJsonPath('result.isError', false)->json('result.structuredContent');

        $this->assertSame('completed', $result['state']);
        $this->assertSame('AssignRecord', $result['command']);
        $this->assertSame(1, $result['outcome_count']);
        $this->assertSame([], $result['next_actions']);
    }
}
