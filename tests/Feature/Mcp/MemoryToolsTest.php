<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsMcpFrames;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

#[TimeLimit(5, 'Signed calls cover reconnect, memory writes, and profile discovery.')]
final class MemoryToolsTest extends TestCase
{
    use CommitsHookRows;
    use SendsMcpFrames;

    private const string MEMORY_TEXT = 'Use the same key to retry.';

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'memories', 'command_receipts',
    ];

    public function test_the_owner_can_read_edit_and_remove_a_saved_memory_after_reconnect(): void
    {
        $caller = TestStart::start();
        $memory = $this->callMcpTool($caller, 'memories_create', [
            'text' => 'Use the same key to retry.',
            'weight' => 5,
            'request_key' => 'create-memory',
        ])->assertJsonPath('result.isError', false)->json('result.structuredContent.memory_id');

        $this->sendMcp($caller, 'initialize', [
            'protocolVersion' => '2025-11-25',
            'capabilities' => (object) [],
            'clientInfo' => ['name' => 'test', 'version' => '1'],
        ])->assertOk();
        $this->callMcpTool($caller, 'memories_list')
            ->assertJsonPath('result.structuredContent.cards.0.memory_id', $memory);
        $read = $this->callMcpTool($caller, 'memories_read', ['memory_id' => $memory])
            ->assertJsonPath('result.structuredContent.text', self::MEMORY_TEXT)
            ->assertJsonPath('result.structuredContent.revision', 1)
            ->json('result.structuredContent');
        $resource = $this->sendMcp($caller, 'resources/read', ['uri' => "journal://v1/memories/{$memory}"])
            ->assertOk()->json('result.contents.0.text');
        $this->assertSame($read, json_decode($resource, true, flags: JSON_THROW_ON_ERROR));

        $this->callMcpTool($caller, 'memories_edit', [
            'memory_id' => $memory,
            'expected_revision' => $read['revision'],
            'weight' => 8,
            'request_key' => 'edit-memory',
        ])->assertJsonPath('result.isError', false);
        $this->callMcpTool($caller, 'memories_read', ['memory_id' => $memory])
            ->assertJsonPath('result.structuredContent.weight', 8)
            ->assertJsonPath('result.structuredContent.revision', 2);

        $this->callMcpTool($caller, 'memories_remove', ['memory_id' => $memory, 'request_key' => 'remove-memory'])
            ->assertJsonPath('result.isError', false);
        $this->callMcpTool($caller, 'memories_read', ['memory_id' => $memory])
            ->assertJsonPath('result.structuredContent.code', 'record_unavailable');
    }

    public function test_a_reviewer_discovers_no_memory_tools_and_cannot_call_one_by_name(): void
    {
        $reviewer = TestStart::start('read-only-helper');
        $arguments = [];
        $tools = [];

        do {
            $page = $this->sendMcp($reviewer, 'tools/list', $arguments)->assertOk()->json('result');
            $tools = [...$tools, ...array_column($page['tools'], 'name')];
            $arguments = isset($page['nextCursor']) ? ['cursor' => $page['nextCursor']] : [];
        } while ($arguments !== []);

        $this->assertSame([], array_values(array_filter($tools, fn (string $name) => str_starts_with(
            $name,
            'memories_',
        ))));
        $this->sendMcp($reviewer, 'tools/call', [
            'name' => 'memories_create',
            'arguments' => ['text' => 'No access.', 'weight' => 1, 'request_key' => 'forged-memory'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
    }
}
