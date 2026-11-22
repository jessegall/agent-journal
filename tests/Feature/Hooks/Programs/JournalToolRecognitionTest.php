<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Drivers;

use App\Hooks\Contracts\JournalToolNames;
use App\Hooks\Drivers\Adapters\ClaudeCodeAdapter;
use App\Hooks\Drivers\Adapters\CodexAdapter;
use App\Hooks\Drivers\Adapters\JournalToolCall;
use App\Hooks\Drivers\Adapters\JudgedCall;
use App\Hooks\Drivers\Contracts\DriverAdapter;
use App\Hooks\Drivers\HookPayload;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Mcp\Support\McpCatalogue;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\ChecksProgramFixtures;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Both adapters let a call to the journal's own MCP server, its tool search and its resources through without walking
 * the stack, before and after the call; a tool of another server, a name the journal does not offer and a resource of
 * another server or address stay refused.
 */
final class JournalToolRecognitionTest extends TestCase
{
    use ChecksProgramFixtures;
    use RefreshHookDatabase;

    protected static function fixtureFolder(): string
    {
        return 'ClaudeCode';
    }

    /**
     * @return iterable<string, array{class-string<DriverAdapter>, string, string, string}>
     */
    public static function drivers(): iterable
    {
        yield 'Claude Code' => [ClaudeCodeAdapter::class, 'ToolSearch', 'ReadMcpResourceTool', 'ListMcpResourcesTool'];

        yield 'Codex' => [CodexAdapter::class, 'tool_search', 'read_mcp_resource', 'list_mcp_resources'];
    }

    /**
     * @return iterable<string, array{class-string<DriverAdapter>, string}>
     */
    public static function resourceReaders(): iterable
    {
        yield 'Claude Code' => [ClaudeCodeAdapter::class, 'ReadMcpResourceTool'];

        yield 'Codex' => [CodexAdapter::class, 'read_mcp_resource'];
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

        foreach (['mcp__journal__tasks_assigned', $toolSearch, $listResources] as $toolName) {
            $starting = $driver->callFor(self::toolPayload('PreToolUse', $toolName, []), $this->hook());
            $finished = $driver->callFor(self::toolPayload('PostToolUse', $toolName, []), $this->hook());

            $this->assertInstanceOf(JournalToolCall::class, $starting);
            $this->assertInstanceOf(JournalToolCall::class, $finished);
            $this->assertSame(
                '{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}',
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
