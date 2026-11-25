<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Events\Sessions\StartSettingsRequested;
use App\Listeners\SupplyHookSettings;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Adapters\ClaudeCodeAdapter;
use App\Support\IsolatedHookSettings;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A Claude launch's generated settings allow the journal's own MCP tools by their literal server prefix and no other
 * server, beside every denial; Codex gets no such rule, since its account entry approves the journal. The launch's
 * descriptor, flags and timeouts are the Go host's, proven in tools/journal-agent/profiles/claude_account_test.go.
 */
final class ClaudeMcpStartTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_claude_launch_allows_only_the_journal_server_and_keeps_every_denial(): void
    {
        $permissions = $this->permissionsOf(DefaultDrivers::CLAUDE_CODE);

        $this->assertSame(['mcp__journal__*'], $permissions['allow']);
        $this->assertSame(ClaudeCodeAdapter::NATIVE_CHILD_TOOLS, $permissions['deny']);
    }

    public function test_a_codex_launch_gets_no_allow_rule(): void
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
