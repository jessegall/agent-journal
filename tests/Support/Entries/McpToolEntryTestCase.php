<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\McpCatalogue;
use App\Mcp\Tools\JournalTool;
use App\Support\Reflector;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMcpTool;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The entry test of one MCP tool, named by #[TestsMcpTool]: the arranged call answers no error, a write tool sends
 * exactly the commands it declares with #[Dispatches] through every middleware, and a read tool sends nothing. An
 * unsigned frame and a profile that does not see the tool are refused.
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

        $response = $this->journal->mcpTool($call->start, $this->toolName(), $call->arguments);

        $this->assertSame(200, $response->getStatusCode(), (string) $response->getContent());
        $this->assertFalse($response->json('result.isError'), (string) $response->getContent());

        $this->journal->assertDispatchedOnlyDeclared(DeclaredCommands::ofTool($this->tool()), $this->tool())
            ->assertDispatchedExactly($call->expected);
        $this->assertNotSame('', (string) $response->json('result.content.0.text'), 'The tool answered no text.');
    }

    public function test_an_unsigned_frame_and_a_profile_without_the_tool_are_refused(): void
    {
        $call = $this->arrange($this->journal);
        $profile = $this->hiddenProfile();
        $hidden = $profile === null ? null : $this->journal->signedStart('Profile without the tool', $profile->value);
        $this->journal->heartbeatOf($call->start);

        if ($hidden !== null) {
            $this->journal->heartbeatOf($hidden);
        }

        $this->journal->sinkCommands()->sinkReplies($call->replies);

        $this->postJson(self::MCP_ADDRESS, $this->frame($call->arguments))->assertUnauthorized();
        $this->journal->assertNothingDispatched();

        if ($hidden === null) {
            $this->markTestSkipped("Every profile sees {$this->toolName()}.");
        }

        $answer = $this->journal->mcpTool($hidden, $this->toolName(), $call->arguments);

        $this->assertTrue(
            $answer->json('error') !== null || $answer->json('result.isError') === true,
            "{$this->toolName()} answered a start of {$profile->value}, which does not see it.",
        );
        $this->journal->assertNothingDispatched();
    }

    /**
     * @return class-string<JournalTool>
     */
    private function tool(): string
    {
        return Reflector::of($this)->attribute(TestsMcpTool::class)->tool;
    }

    /**
     * The first profile the tool's VisibleToProfiles leaves out, whose start the tool must refuse.
     */
    private function hiddenProfile(): DiscoveryProfile|null
    {
        $tool = Reflector::of($this->tool())->newInstanceWithoutConstructor();

        return array_find(DiscoveryProfile::cases(), fn (DiscoveryProfile $profile) => ! $tool->isVisibleTo($profile));
    }

    private function toolName(): string
    {
        return $this->app->make(McpCatalogue::class)->toolName($this->tool());
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
