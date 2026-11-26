<?php

declare(strict_types=1);

namespace Tests\Machinery\Seeding;

use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The journal sends MCP frames signed by an agent's start: the transport answer, a tool's failure and the frame's own
 * JSON-RPC id are each seen apart.
 */
#[TestsMachinery(TestJournal::class)]
final class JournalMcpTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_frame_keeps_its_own_id(): void
    {
        $this->journal->owner()->agent('Ada');

        $this->journal->mcpFrame('Ada', '{"jsonrpc":"2.0","id":"frame-7","method":"ping","params":{}}')
            ->assertOk()
            ->assertJsonPath('id', 'frame-7');
    }

    public function test_a_tool_failure_comes_back_over_a_good_transport_with_the_rpc_id(): void
    {
        $this->journal->owner()->agent('Ada');

        $this->journal->mcpTool('Ada', 'operations_read', [], rpcId: 42)
            ->assertOk()
            ->assertJsonPath('id', 42)
            ->assertJsonPath('result.isError', true);
    }

    public function test_a_start_that_was_replaced_is_refused_at_the_transport(): void
    {
        $this->journal->owner()->idleAgent('Writer')->startSession('Writer', 'First')->startSession('Writer', 'Second');

        $this->journal->mcpFrame('First', '{"jsonrpc":"2.0","id":1,"method":"ping","params":{}}')->assertUnauthorized();
    }

    public function test_a_request_of_a_method_goes_out_as_one_frame_under_id_one(): void
    {
        $this->journal->owner()->agent('Ada');

        $this->journal->mcpRequest('Ada', 'ping')->assertOk()->assertJsonPath('id', 1);
    }
}
