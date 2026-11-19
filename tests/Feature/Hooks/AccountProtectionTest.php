<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Agents\Contracts\SessionOutputAccess;
use App\Agents\Support\SessionOutputPaths;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Programs\ClaudeAccountProtection;
use App\Hooks\Programs\ClaudeCodeAdapter;
use App\Hooks\Programs\HookPayload;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Claude Code's file and shell tools never reach a saved account's sign-in, settings or another session's history:
 * the per-launch settings deny them natively and the journal refuses every read inside the accounts folder that is
 * not the session's own granted output, whatever alias the path takes.
 */
final class AccountProtectionTest extends TestCase
{
    use RefreshHookDatabase;

    public const string OWN_OUTPUTS = '/journal/accounts/a/projects/-work/own';

    protected function setUp(): void
    {
        parent::setUp();

        config(['accounts.root' => '/journal/accounts']);
        $this->app->instance(SessionOutputAccess::class, new class implements SessionOutputAccess
        {
            public function grantedTo(string $sessionId): array
            {
                return $sessionId === 'session-1'
                    ? [
                        new SessionOutputPaths(
                            AccountProtectionTest::OWN_OUTPUTS.'.jsonl',
                            AccountProtectionTest::OWN_OUTPUTS,
                        ),
                    ]
                    : [];
            }

            public function mayRead(string $sessionId, string $path): bool
            {
                foreach ($this->grantedTo($sessionId) as $paths) {
                    if ($paths->contains($path)) {
                        return true;
                    }
                }

                return false;
            }
        });
    }

    public function test_reads_inside_the_accounts_folder_pass_only_for_the_sessions_own_outputs(): void
    {
        $this->assertSame('allow', $this->decision('Read', ['file_path' => self::OWN_OUTPUTS.'/tool-results/a.txt']));
        $this->assertSame('allow', $this->decision('Grep', ['pattern' => 'x', 'path' => self::OWN_OUTPUTS]));
        $this->assertSame('allow', $this->decision('Read', ['file_path' => 'src/a.php']));
        $this->assertSame('deny', $this->decision('Read', ['file_path' => '/journal/accounts/a/.credentials.json']));
        $this->assertSame('deny', $this->decision('Read', ['file_path' => '../journal/accounts/a/b.jsonl']));
        $this->assertSame('deny', $this->decision('Read', ['file_path' => self::OWN_OUTPUTS.'/../b/tool-results/x']));
        $this->assertSame('deny', $this->decision('Glob', ['pattern' => '/journal/accounts/*/projects/**/*.jsonl']));
        $this->assertSame('deny', $this->decision('LS', ['path' => '/journal/accounts']));
        $this->assertSame('deny', $this->decision('Read', ['file_path' => self::OWN_OUTPUTS.'/x'], 'session-2'));
    }

    public function test_changes_and_commands_that_reach_a_sign_in_are_refused(): void
    {
        $this->assertSame('deny', $this->decision('Write', ['file_path' => self::OWN_OUTPUTS.'/x', 'content' => '']));
        $this->assertSame('deny', $this->decision('Bash', ['command' => 'security find-generic-password -s claude']));
        $this->assertSame('deny', $this->decision('Bash', ['command' => 'cat /journal/accounts/a/.credentials.json']));
        $this->assertSame('deny', $this->decision('Bash', ['command' => 'claude auth status']));
        $this->assertSame('deny', $this->decision('Bash', ['command' => 'ls $CLAUDE_CONFIG_DIR']));
    }

    public function test_the_launch_settings_deny_secrets_natively_and_close_the_unsandboxed_escape(): void
    {
        $settings = json_decode(ClaudeAccountProtection::settingsFor('/journal/accounts/a', '/journal/accounts'), true);

        $this->assertContains('Read(//journal/accounts/a/.credentials.json)', $settings['permissions']['deny']);
        $this->assertContains('Read(//journal/accounts/a/settings.json)', $settings['permissions']['deny']);
        $this->assertContains('Edit(//journal/accounts/**)', $settings['permissions']['deny']);
        $this->assertContains('Bash(security:*)', $settings['permissions']['deny']);
        $this->assertNotContains('Read(//journal/accounts/a/**)', $settings['permissions']['deny']);
        $this->assertTrue($settings['sandbox']['enabled']);
        $this->assertFalse($settings['sandbox']['allowUnsandboxedCommands']);
    }

    /**
     * @param  array<string, string>  $toolInput
     */
    private function decision(string $tool, array $toolInput, string $sessionId = 'session-1'): string
    {
        $payload = HookPayload::from([
            'hook_event_name' => 'PreToolUse',
            'session_id' => 'native-1',
            'cwd' => '/work',
            'tool_name' => $tool,
            'tool_input' => $toolInput,
        ]);
        $call = $this->app->make(ClaudeCodeAdapter::class)->callFor(
            $payload,
            new HookIdentity('agent-1', $sessionId, 'call-1', 'digest'),
        );
        $reply = json_decode($call->replyWith(fn () => null)->stdout, true);

        return $reply['hookSpecificOutput']['permissionDecision'] ?? 'allow';
    }
}
