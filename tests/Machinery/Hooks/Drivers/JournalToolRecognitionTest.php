<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks\Drivers;

use App\Agents\Contracts\Domains\JournalToolNames;
use App\Agents\Drivers\ClaudeCode\ClaudeCodeAdapter;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Hooks\HookPayload;
use App\Agents\Drivers\Hooks\JournalToolCall;
use App\Agents\Drivers\Hooks\JudgedCall;
use App\Exceptions\UnsupportedHook;
use App\Mcp\Support\McpCatalogue;
use App\Support\DomainRegistry;
use App\Support\Inputs\StopRequested;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ChecksProgramFixtures;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Both adapters let a call to the journal's own MCP server, its tool search and its resources through without walking
 * the stack, before and after the call; a tool of another server, a name the journal does not offer and a resource of
 * another server or address stay refused.
 */
#[TestsMachinery(JournalToolCall::class)]
final class JournalToolRecognitionTest extends TestCase
{
    use ChecksProgramFixtures;
    use RefreshHookDatabase;

    /**
     * Every installed domain, since the journal tools and routes this test names come from them.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 4));
    }

    protected static function fixtureFolder(): string
    {
        return 'ClaudeCode';
    }

    /**
     * @return iterable<string, array{class-string<DriverAdapter>, string, string, string}>
     */
    public static function drivers(): iterable
    {
        yield 'Claude Code' => [
            ClaudeCodeAdapter::class,
            'ToolSearch',
            'ReadMcpResourceTool',
            'ListMcpResourcesTool',
        ];

        yield 'Codex' => [
            CodexAdapter::class,
            'tool_search',
            'read_mcp_resource',
            'list_mcp_resources',
        ];
    }

    /**
     * @return iterable<string, array{class-string<DriverAdapter>, string}>
     */
    public static function resourceReaders(): iterable
    {
        yield 'Claude Code' => [
            ClaudeCodeAdapter::class,
            'ReadMcpResourceTool',
        ];

        yield 'Codex' => [
            CodexAdapter::class,
            'read_mcp_resource',
        ];
    }

    public function test_the_catalogue_names_the_journal_tools_hooks_recognize(): void
    {
        $names = $this->app->make(JournalToolNames::class);

        $this->assertInstanceOf(McpCatalogue::class, $names);
        $this->assertContains('tasks_assigned', $names->toolNames());
    }

    /**
     * @param  class-string<DriverAdapter>  $adapter
     */
    #[DataProvider('drivers')]
    public function test_a_journal_tool_call_passes_without_a_stack_walk(
        string $adapter,
        string $toolSearch,
        string $readResource,
        string $listResources,
    ): void {
        $driver = $this->app->make($adapter);

        foreach ([
            'mcp__journal__tasks_assigned',
            $toolSearch,
            $listResources,
        ] as $toolName) {
            $starting = $driver->callFor(self::toolPayload('PreToolUse', $toolName, []), $this->hook());
            $finished = $driver->callFor(self::toolPayload('PostToolUse', $toolName, []), $this->hook());

            $this->assertInstanceOf(JournalToolCall::class, $starting);
            $this->assertInstanceOf(JournalToolCall::class, $finished);
            $this->assertSame(
                '{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"allow"}}',
                $starting->replyWith(fn () => $this->fail('A journal call walked the stack.'))->stdout,
            );
            $this->assertSame(
                '{}',
                $finished->replyWith(fn () => $this->fail('A journal call walked the stack.'))->stdout,
            );
        }

        $resource = ['server' => 'journal', 'uri' => 'journal://v1/tasks/12'];

        $this->assertInstanceOf(
            JournalToolCall::class,
            $driver->callFor(self::toolPayload('PreToolUse', $readResource, $resource), $this->hook()),
        );
    }

    /**
     * @param  class-string<DriverAdapter>  $adapter
     */
    #[DataProvider('resourceReaders')]
    public function test_other_servers_names_and_addresses_stay_refused(string $adapter, string $readResource): void
    {
        $driver = $this->app->make($adapter);
        $refused = [
            ['mcp__other__x', []],
            ['mcp__journal__not_offered', []],
            [$readResource, ['server' => 'other', 'uri' => 'journal://v1/tasks/12']],
            [$readResource, ['server' => 'journal', 'uri' => 'file:///etc/passwd']],
        ];

        foreach ($refused as [$toolName, $arguments]) {
            $this->assertThrows(
                fn () => $driver->callFor(self::toolPayload('PreToolUse', $toolName, $arguments), $this->hook()),
                UnsupportedHook::class,
            );
        }

        $this->assertInstanceOf(
            JudgedCall::class,
            $driver->callFor(self::toolPayload('PostToolUse', 'mcp__other__x', []), $this->hook()),
        );
    }

    #[DataProvider('drivers')]
    public function test_a_stop_carries_the_words_the_agent_closed_its_turn_with(
        string $adapter,
        string $toolSearch,
        string $readResource,
        string $listResources,
    ): void {
        $closingWords = 'It-is-4.';

        $call = $this->app->make($adapter)->callFor(HookPayload::from([
            'session_id' => 'session-redacted',
            'hook_event_name' => 'Stop',
            'stop_hook_active' => false,
            'last_assistant_message' => "  {$closingWords}\n",
        ]), $this->hook());

        $this->assertInstanceOf(JudgedCall::class, $call);
        $this->assertInstanceOf(StopRequested::class, $call->input);
        $this->assertSame($closingWords, $call->input->stop->closingWords);
    }

    /**
     * @param  array<string, string>  $arguments
     */
    private static function toolPayload(string $hookEventName, string $toolName, array $arguments): HookPayload
    {
        return HookPayload::from([
            'session_id' => 'session-redacted',
            'transcript_path' => '/redacted/transcript.jsonl',
            'cwd' => '/redacted',
            'hook_event_name' => $hookEventName,
            'tool_name' => $toolName,
            'tool_input' => $arguments,
            'tool_response' => ['content' => 'done'],
            'tool_use_id' => 'tool-redacted',
        ]);
    }
}
