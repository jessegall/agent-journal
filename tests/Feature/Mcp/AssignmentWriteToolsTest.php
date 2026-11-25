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
use Tests\TestCase;

final class AssignmentWriteToolsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'assignments',
        'agent_stacks',
        'command_receipts',
    ];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    private TestStart $caller;

    private TestStart $first;

    private TestStart $second;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->caller = TestStart::start();
        $this->first = TestStart::start('writing-helper');
        $this->second = TestStart::start('writing-helper');
        $this->task = Task::factory()->create(['title' => 'Prepare the handoff']);
    }

    public function test_all_three_cli_operations_replay_their_mcp_results(): void
    {
        $first = $this->assignFirst();
        $second = $this->reassign($first);
        $this->journal->mcpTool($this->caller, 'assignments_unassign', [
            ...$this->record(),
            'expected_assignment' => $second,
            'request_key' => 'unassign',
        ])->assertOk()->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment', null);

        $this->journal->relayAgentCommands($this->caller);
        $record = ['type' => 'tasks.task', 'id' => $this->task->id, '--json' => true];
        $this->artisan('assignment:assign', [
            ...$record,
            '--to' => "agent:{$this->first->agent->id}",
            '--request-key' => 'assign',
        ])->expectsOutputToContain($first['id'])->assertExitCode(0);
        $this->artisan('assignment:reassign', [
            ...$record,
            '--assignment' => $first['id'],
            '--holder' => "agent:{$this->first->agent->id}",
            '--to' => "agent:{$this->second->agent->id}",
            '--request-key' => 'reassign',
        ])->expectsOutputToContain($second['id'])->assertExitCode(0);
        $this->artisan('assignment:unassign', [
            ...$record,
            '--assignment' => $second['id'],
            '--holder' => "agent:{$this->second->agent->id}",
            '--request-key' => 'unassign',
        ])->expectsOutputToContain('"changed":1')->assertExitCode(0);

        $this->journal->mcpTool($this->caller, 'assignments_read', $this->record())->assertOk()
            ->assertJsonPath('result.structuredContent.holder', null);
    }

    /**
     * @return array{id: string, holder: array{type: string, id: string}}
     */
    private function assignFirst(): array
    {
        return $this->journal->mcpTool($this->caller, 'assignments_assign', [
            ...$this->record(),
            'recipient' => $this->recipient($this->first),
            'request_key' => 'assign',
        ])->assertOk()->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment.holder', $this->recipient($this->first))
            ->json('result.structuredContent.assignment');
    }

    /**
     * @param  array{id: string, holder: array{type: string, id: string}}  $first
     * @return array{id: string, holder: array{type: string, id: string}}
     */
    private function reassign(array $first): array
    {
        return $this->journal->mcpTool($this->caller, 'assignments_reassign', [
            ...$this->record(),
            'expected_assignment' => $first,
            'recipient' => $this->recipient($this->second),
            'request_key' => 'reassign',
        ])->assertOk()->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment.holder', $this->recipient($this->second))
            ->json('result.structuredContent.assignment');
    }

    /**
     * @return array{record_type: string, record_id: string}
     */
    private function record(): array
    {
        return ['record_type' => 'tasks.task', 'record_id' => $this->task->id];
    }

    /**
     * @return array{type: string, id: string}
     */
    private function recipient(TestStart $start): array
    {
        return ['type' => 'agent', 'id' => $start->agent->id];
    }
}
