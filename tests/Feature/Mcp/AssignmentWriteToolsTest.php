<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Assignments\Events\AssignmentsChanged;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

final class AssignmentWriteToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;
    use SendsSignedCalls;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'tasks',
        'assignments',
        'agent_stacks',
        'command_receipts',
    ];

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

    public function test_assign_and_repeat_return_the_reference_and_dispatch_one_change_event(): void
    {
        Event::fake([AssignmentsChanged::class]);
        $reference = $this->assignFirst();

        $this->callMcpTool($this->caller, 'assignments_assign', [
            ...$this->record(),
            'recipient' => $this->recipient($this->first),
            'request_key' => 'repeat-assignment',
        ])->assertJsonPath('result.structuredContent.outcome', 'unchanged')
            ->assertJsonPath('result.structuredContent.changed', 0)
            ->assertJsonPath('result.structuredContent.assignment', $reference);

        Event::assertDispatchedTimes(AssignmentsChanged::class, 1);
    }

    public function test_conflicts_offer_reading_the_current_assignment_and_cannot_replace_it(): void
    {
        $first = $this->assignFirst();
        $this->callMcpTool($this->caller, 'assignments_assign', [
            ...$this->record(),
            'recipient' => $this->recipient($this->second),
            'request_key' => 'already-held',
        ])->assertJsonPath('result.isError', true)
            ->assertJsonPath('result.structuredContent.code', 'conflict')
            ->assertJsonPath('result.structuredContent.next_action.tool', 'assignments_read')
            ->assertJsonPath('result.structuredContent.next_action.arguments', $this->record());

        $second = $this->reassign($first);
        $this->callMcpTool($this->caller, 'assignments_unassign', [
            ...$this->record(),
            'expected_assignment' => $first,
            'request_key' => 'stale-reference',
        ])->assertJsonPath('result.isError', true)->assertJsonPath('result.structuredContent.code', 'conflict');

        $this->callMcpTool($this->caller, 'assignments_read', $this->record())
            ->assertJsonPath('result.structuredContent.holder.reference', $second['id'])
            ->assertJsonPath('result.structuredContent.holder.id', $this->second->agent->id);
    }

    public function test_an_executor_cannot_dispatch_a_record_to_someone_else(): void
    {
        $this->sendMcp($this->first, 'tools/call', [
            'name' => 'assignments_assign',
            'arguments' => [
                ...$this->record(),
                'recipient' => $this->recipient($this->second),
                'request_key' => 'executor-assignment',
            ],
        ])->assertBadRequest();
        $this->signed($this->first, '/agent/assignments/assign', [
            ...$this->record(),
            'recipient_type' => 'agent',
            'recipient_id' => $this->second->agent->id,
            'request_key' => 'executor-assignment',
        ])->assertForbidden();

        $this->callMcpTool($this->caller, 'assignments_read', $this->record())
            ->assertJsonPath('result.structuredContent.holder', null);
    }

    public function test_all_three_cli_operations_replay_their_mcp_results(): void
    {
        $first = $this->assignFirst();
        $second = $this->reassign($first);
        $this->callMcpTool($this->caller, 'assignments_unassign', [
            ...$this->record(),
            'expected_assignment' => $second,
            'request_key' => 'unassign',
        ])->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment', null);

        $this->runCommandsAs($this->caller);
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

        $this->callMcpTool($this->caller, 'assignments_read', $this->record())
            ->assertJsonPath('result.structuredContent.holder', null);
    }

    /** @return array{id: string, holder: array{type: string, id: string}} */
    private function assignFirst(): array
    {
        return $this->callMcpTool($this->caller, 'assignments_assign', [
            ...$this->record(),
            'recipient' => $this->recipient($this->first),
            'request_key' => 'assign',
        ])->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment.holder', $this->recipient($this->first))
            ->json('result.structuredContent.assignment');
    }

    /**
     * @param  array{id: string, holder: array{type: string, id: string}}  $first
     * @return array{id: string, holder: array{type: string, id: string}}
     */
    private function reassign(array $first): array
    {
        return $this->callMcpTool($this->caller, 'assignments_reassign', [
            ...$this->record(),
            'expected_assignment' => $first,
            'recipient' => $this->recipient($this->second),
            'request_key' => 'reassign',
        ])->assertJsonPath('result.structuredContent.outcome', 'changed')
            ->assertJsonPath('result.structuredContent.assignment.holder', $this->recipient($this->second))
            ->json('result.structuredContent.assignment');
    }

    /** @return array{record_type: string, record_id: string} */
    private function record(): array
    {
        return ['record_type' => 'tasks.task', 'record_id' => $this->task->id];
    }

    /** @return array{type: string, id: string} */
    private function recipient(TestStart $start): array
    {
        return ['type' => 'agent', 'id' => $start->agent->id];
    }
}
