<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\JournalWriteTool;
use App\Support\ReflectedType;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The entry test of one MCP tool, named by the class's #[TestsMcpTool]: the arranged tools/call answers a result that
 * is no error; a write tool sends on exactly the expected commands, each one it declares with #[Dispatches] and each
 * through every middleware, and answers text built from the reply; a read tool sends nothing. An unsigned frame is
 * refused, and so is a start whose profile does not see the tool.
 */
abstract class McpToolEntryTestCase extends TestCase
{
    use CommitsHookRows;

    /**
     * None by name: the commands of the test commit, as a repeatable read one must, and what the test wrote is emptied
     * when it ends.
     */
    protected const array TABLES = [];

    private const string MCP_ADDRESS = '/agent/mcp/v1';

    abstract protected function arrange(TestJournal $journal): ToolCall;

    public function test_the_tool_answers_and_dispatches_what_it_declares(): void
    {
        $call = $this->arrange($this->journal);
        $this->journal->heartbeatOf($call->start)->sinkCommands()->sinkReplies($call->replies);

        $response = $this->journal->mcpTool($call->start, $this->toolName(), $call->arguments)
            ->assertOk()
            ->assertJsonPath('result.isError', false);

        $this->journal->assertDispatchedOnlyDeclared(DeclaredCommands::ofTool($this->tool()), $this->tool())
            ->assertDispatchedExactly($this->isWriteTool() ? $call->expected : []);
        $this->assertNotSame('', (string) $response->json('result.content.0.text'), 'The tool answered no text.');
    }

    public function test_an_unsigned_frame_and_a_profile_without_the_tool_are_refused(): void
    {
        $call = $this->arrange($this->journal);
        $this->journal->heartbeatOf($call->start)->sinkCommands()->sinkReplies($call->replies);

        $this->postJson(self::MCP_ADDRESS, $this->frame($call->arguments))->assertUnauthorized();
        $this->journal->assertNothingDispatched();

        if ($call->hiddenFromProfile === null) {
            $this->markTestSkipped("Every profile sees {$this->toolName()}.");
        }

        $hidden = $this->journal->signedStart('Profile without the tool', $call->hiddenFromProfile);
        $answer = $this->journal->mcpTool($hidden, $this->toolName(), $call->arguments);

        $this->assertTrue(
            $answer->json('error') !== null || $answer->json('result.isError') === true,
            "{$this->toolName()} answered a start of {$call->hiddenFromProfile}, which does not see it.",
        );
        $this->journal->assertNothingDispatched();
    }

    /**
     * @return class-string<JournalTool>
     */
    private function tool(): string
    {
        return ReflectedType::of($this)->attribute(TestsMcpTool::class)->tool;
    }

    private function toolName(): string
    {
        return $this->app->make(McpCatalogue::class)->toolName($this->tool());
    }

    private function isWriteTool(): bool
    {
        return ReflectedType::of($this->tool())->isSubclassOf(JournalWriteTool::class);
    }

    /**
     * @param  array<string, mixed>  $arguments
     * @return array<string, mixed>
     */
    private function frame(array $arguments): array
    {
        return [
            'jsonrpc' => '2.0',
            'id' => 1,
            'method' => 'tools/call',
            'params' => [
                'name' => $this->toolName(),
                'arguments' => (object) $arguments,
            ],
        ];
    }
}
