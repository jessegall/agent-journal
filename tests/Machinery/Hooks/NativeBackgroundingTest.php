<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Agents\Drivers\ClaudeCode\ClaudeCodeAdapter;
use App\Agents\Drivers\Codex\CodexAdapter;
use App\Agents\Drivers\Contracts\DriverCall;
use App\Agents\Drivers\Hooks\HookPayload;
use App\Agents\Drivers\Hooks\NativeBackgrounding;
use App\Stacks\AgentStack;
use App\Stacks\HookAnswer;
use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\StackTarget;
use Closure;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * Every process runs through the journal, so neither Claude Code nor Codex backgrounds a command on its own: a line
 * with a trailing &, nohup, setsid or disown, Claude Code's run_in_background and Codex's background terminal are
 * refused, each refusal naming the journal's own background run; a plain line goes on.
 */
#[TestsMachinery(NativeBackgrounding::class)]
final class NativeBackgroundingTest extends TestCase
{
    use RefreshHookDatabase;

    private const string POINTER = 'the journal moves a long run to its own background';

    /**
     * @return iterable<string, array{string}>
     */
    public static function backgroundedLines(): iterable
    {
        yield 'a trailing &' => ['sleep 60 &'];

        yield 'nohup' => ['nohup sleep 60'];

        yield 'setsid' => ['setsid sleep 60'];

        yield 'disown' => ['sleep 60 & disown'];
    }

    #[DataProvider('backgroundedLines')]
    public function test_claude_code_refuses_a_backgrounded_line_and_names_the_journals_run(string $line): void
    {
        $this->assertRefusedWithPointer($this->reply(ClaudeCodeAdapter::class, 'Bash', ['command' => $line]));
    }

    #[DataProvider('backgroundedLines')]
    public function test_codex_refuses_a_backgrounded_line_and_names_the_journals_run(string $line): void
    {
        $this->assertRefusedWithPointer($this->reply(CodexAdapter::class, 'Bash', ['command' => $line]));
    }

    public function test_claude_codes_own_background_run_is_refused(): void
    {
        $toolInput = ['command' => 'sleep 60', 'run_in_background' => true];

        $this->assertRefusedWithPointer($this->reply(ClaudeCodeAdapter::class, 'Bash', $toolInput));
    }

    public function test_codexs_background_terminal_is_refused(): void
    {
        $toolInput = ['session_id' => 3, 'chars' => ''];

        $this->assertRefusedWithPointer($this->reply(CodexAdapter::class, 'write_stdin', $toolInput));
    }

    public function test_a_line_run_in_the_foreground_is_not_refused_as_backgrounded(): void
    {
        $claude = $this->reply(ClaudeCodeAdapter::class, 'Bash', ['command' => 'ls', 'run_in_background' => false]);
        $codex = $this->reply(CodexAdapter::class, 'Bash', ['command' => 'ls']);

        $this->assertSame(
            [false, false],
            [
                str_contains($claude['permissionDecisionReason'] ?? '', self::POINTER),
                str_contains($codex['permissionDecisionReason'] ?? '', self::POINTER),
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $reply
     */
    private function assertRefusedWithPointer(array $reply): void
    {
        $decision = $reply['permissionDecision'] ?? 'allow';
        $namesTheJournalsRun = str_contains($reply['permissionDecisionReason'] ?? '', self::POINTER);

        $this->assertSame(['deny', true], [$decision, $namesTheJournalsRun]);
    }

    /**
     * The hook-specific output of the driver's reply to the call when the journal's walk would allow it, so a refusal
     * before the walk is what shows.
     *
     * @param  class-string<ClaudeCodeAdapter|CodexAdapter>  $adapter
     * @param  array<string, mixed>  $toolInput
     * @return array<string, mixed>
     */
    private function reply(string $adapter, string $tool, array $toolInput): array
    {
        $payload = HookPayload::from([
            'hook_event_name' => 'PreToolUse',
            'session_id' => 'native-1',
            'cwd' => '/work',
            'tool_name' => $tool,
            'tool_input' => $toolInput,
        ]);
        $hook = new HookIdentity('agent-1', 'session-1', 'call-1', 'digest');
        $call = $this->app->make($adapter)->callFor($payload, $hook);

        return self::outputOf($call);
    }

    /**
     * @return array<string, mixed>
     */
    private static function outputOf(DriverCall $call): array
    {
        $allowed = new HookAnswer(
            Decision::allow(),
            [],
            [],
            new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1')),
        );
        $reply = $call->replyWith(fn (HookInput $input, Closure $render) => $render($allowed, TestText::renderer()));

        return json_decode($reply->stdout, true)['hookSpecificOutput'] ?? [];
    }
}
