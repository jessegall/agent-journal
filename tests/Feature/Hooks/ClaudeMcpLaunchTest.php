<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Events\StartSettingsRequested;
use App\Agents\Support\IsolatedHookSettings;
use App\Hooks\Listeners\SupplyHookSettings;
use App\Programs\Enums\HookProgram;
use Tests\TestCase;

/**
 * A Claude launch's generated settings allow the journal's own MCP tools by their literal server prefix and no other
 * server, beside every denial; Codex gets no such rule, since its account entry approves the journal. The launch's
 * descriptor, flags and timeouts are the Go host's, proven in tools/journal-agent/profiles/claude_account_test.go.
 */
final class ClaudeMcpLaunchTest extends TestCase
{
    public function test_a_claude_launch_allows_only_the_journal_server_and_keeps_every_denial(): void
    {
        $permissions = $this->permissionsOf(HookProgram::ClaudeCode);

        $this->assertSame(['mcp__journal__*'], $permissions['allow']);
        $this->assertSame(HookProgram::ClaudeCode->nativeChildTools(), $permissions['deny']);
    }

    public function test_a_codex_launch_gets_no_allow_rule(): void
    {
        $this->assertSame([], $this->permissionsOf(HookProgram::Codex)['allow']);
    }

    /**
     * @return array{allow: list<string>, deny: list<string>}
     */
    private function permissionsOf(HookProgram $program): array
    {
        $settings = new IsolatedHookSettings();
        new SupplyHookSettings()->handle(new StartSettingsRequested($program->value, $settings));

        return json_decode($settings->content(), true, flags: JSON_THROW_ON_ERROR)['permissions'];
    }
}
