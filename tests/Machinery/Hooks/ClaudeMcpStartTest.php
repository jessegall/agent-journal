<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeAdapter;
use App\Agents\Drivers\DefaultDrivers;
use App\Events\Sessions\StartSettingsRequested;
use App\Listeners\SupplyHookSettings;
use App\Sessions\IsolatedHookSettings;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A Claude start's generated settings allow the journal's own MCP tools by their literal server prefix and no other
 * server, beside every denial; Codex gets no such rule, since its account entry approves the journal. The start's
 * descriptor, flags and timeouts are the Go host's, proven in programs/runner/profiles/claude_account_test.go.
 */
#[TestsMachinery(IsolatedHookSettings::class)]
final class ClaudeMcpStartTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_claude_start_allows_only_the_journal_server_and_keeps_every_denial(): void
    {
        $permissions = $this->permissionsOf(DefaultDrivers::CLAUDE_CODE);

        $this->assertSame(['mcp__journal__*'], $permissions['allow']);
        $this->assertSame(ClaudeCodeAdapter::NATIVE_CHILD_TOOLS, $permissions['deny']);
    }

    public function test_a_codex_start_gets_no_allow_rule(): void
    {
        $this->assertSame([], $this->permissionsOf(DefaultDrivers::CODEX)['allow']);
    }

    /**
     * @return array{allow: list<string>, deny: list<string>}
     */
    private function permissionsOf(string $driver): array
    {
        $settings = new IsolatedHookSettings();
        $this->app->make(SupplyHookSettings::class)->handle(new StartSettingsRequested($driver, $settings));

        return json_decode($settings->content(), true, flags: JSON_THROW_ON_ERROR)['permissions'];
    }
}
