<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Agents\Models\AgentRuntime;
use App\Agents\Values\StackTarget;
use App\Hooks\Contracts\DriverCall;
use App\Hooks\Contracts\HookInput;
use App\Hooks\Decisions\Decision;
use App\Hooks\Drivers\ClaudeCodeAdapter;
use App\Hooks\Drivers\CodexAdapter;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\HookPayload;
use App\Hooks\Drivers\JudgedCall;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Stack\AgentStack;
use App\Hooks\Stack\HookAnswer;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Support\ShellParser;
use App\Skills\Support\DeliveredSkillsAccess;
use Closure;
use Tests\Fixtures\Hooks\InMemoryStateFactory;
use Tests\Support\CommittedHookStack;
use Tests\TestCase;

/**
 * The hook keeps each runtime's delivered skills its own: another runtime's settings folder is neither read nor
 * written, the agent's own delivered SKILL.md is never written, and a refusal names no path or runtime.
 */
final class DeliveredSkillsGuardTest extends TestCase
{
    use CommittedHookStack;

    private const string STATE_FOLDER = '/Users/someone/.journal-agent';

    private const string OTHER_RUNTIME = '01jd8x0g9m3qz6v4k2t7r5w1zz';

    public function test_a_read_of_another_runtimes_skills_is_refused_without_naming_its_path(): void
    {
        $path = self::STATE_FOLDER.'/runtimes/'.self::OTHER_RUNTIME.'/journal-skills/skills/journal/SKILL.md';

        $reply = $this->claudeCode('Read', ['file_path' => $path]);

        $this->assertRefusedWith(DeliveredSkillsAccess::OTHER_RUNTIME, $reply);
        $this->assertStringNotContainsString(self::OTHER_RUNTIME, $reply->stdout);
        $this->assertStringNotContainsString(self::STATE_FOLDER, $reply->stdout);
    }

    public function test_a_search_inside_another_runtimes_folder_is_refused(): void
    {
        $reply = $this->claudeCode('Grep', ['pattern' => 'journal', 'path' => $this->otherRuntimeFolder()]);

        $this->assertRefusedWith(DeliveredSkillsAccess::OTHER_RUNTIME, $reply);
    }

    public function test_an_edit_of_the_agents_own_delivered_skill_is_refused_without_naming_its_path(): void
    {
        $path = $this->ownRuntimeFolder().'/journal-skills/skills/journal/SKILL.md';

        $reply = $this->claudeCode('Edit', ['file_path' => $path, 'old_string' => 'a', 'new_string' => 'b']);

        $this->assertRefusedWith(DeliveredSkillsAccess::DELIVERED_SKILL, $reply);
        $this->assertStringNotContainsString($this->ownRuntimeId(), $reply->stdout);
        $this->assertStringNotContainsString(self::STATE_FOLDER, $reply->stdout);
    }

    public function test_a_codex_patch_of_its_own_delivered_skill_is_refused(): void
    {
        $patch = "*** Begin Patch\n*** Update File: {$this->ownRuntimeFolder()}/skills/journal/SKILL.md\n@@\n-a\n+b\n"
            .'*** End Patch';

        $call = $this->app->make(CodexAdapter::class)->callFor(
            $this->payload('apply_patch', ['command' => $patch]),
            $this->hookIdentity(),
        );

        $this->assertRefusedWith(
            DeliveredSkillsAccess::DELIVERED_SKILL,
            $call->replyWith(fn () => $this->fail('A refused patch went to the journal.')),
        );
    }

    public function test_the_agent_reads_its_own_skills_and_edits_other_files_as_before(): void
    {
        $ownSkill = $this->ownRuntimeFolder().'/journal-skills/skills/a/SKILL.md';
        $read = $this->claudeCode('Read', ['file_path' => $ownSkill]);
        $edit = $this->app->make(ClaudeCodeAdapter::class)->callFor(
            $this->payload('Edit', ['file_path' => '/work/project/SKILL.md', 'old_string' => 'a', 'new_string' => 'b']),
            $this->hookIdentity(),
        );

        $this->assertSame('{"hookSpecificOutput":{"hookEventName":"PreToolUse"}}', $read->stdout);
        $this->assertInstanceOf(JudgedCall::class, $edit);
        $this->assertInstanceOf(FileEditRequested::class, $edit->input);
    }

    public function test_a_codex_shell_read_of_another_runtimes_skills_is_refused_without_naming_its_path(): void
    {
        $this->useTheRealShellParser();

        $reply = $this->codexShell('cat '.$this->otherRuntimeFolder().'/skills/journal/SKILL.md')
            ->replyWith(fn () => $this->fail('A refused shell read went to the journal.'));

        $this->assertRefusedWith(DeliveredSkillsAccess::OTHER_RUNTIME, $reply);
        $this->assertStringNotContainsString(self::OTHER_RUNTIME, $reply->stdout);
    }

    public function test_a_codex_shell_read_of_its_own_skills_goes_on_to_the_journal(): void
    {
        $this->useTheRealShellParser();

        $call = $this->codexShell('cat '.$this->ownRuntimeFolder().'/skills/journal/SKILL.md');

        $this->assertInstanceOf(JudgedCall::class, $call);
        $this->assertInstanceOf(ShellCommandRequested::class, $call->input);
    }

    public function test_a_shell_line_the_parser_cannot_read_is_judged_word_by_word(): void
    {
        $call = $this->codexShell('cat "$(echo '.$this->otherRuntimeFolder().'/skills/journal/SKILL.md)"');

        $this->assertRefusedWith(
            DeliveredSkillsAccess::OTHER_RUNTIME,
            $call->replyWith(fn () => $this->fail('A refused shell read went to the journal.')),
        );
    }

    public function test_a_claude_code_shell_read_of_another_runtimes_folder_is_refused(): void
    {
        $this->useTheRealShellParser();

        $reply = $this->claudeCode('Bash', ['command' => 'ls '.$this->otherRuntimeFolder()]);

        $this->assertRefusedWith(DeliveredSkillsAccess::OTHER_RUNTIME, $reply);
    }

    private function codexShell(string $line): DriverCall
    {
        return $this->app->make(CodexAdapter::class)->callFor(
            $this->payload('Bash', ['command' => $line]),
            $this->hookIdentity(),
        );
    }

    /**
     * The Processes parser instead of the listed test parser, so a plain line parses into its parts.
     */
    private function useTheRealShellParser(): void
    {
        $this->app->scoped(ShellCommandParser::class, ShellParser::class);
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function claudeCode(string $tool, array $arguments): DriverReply
    {
        $allowed = new HookAnswer(Decision::allow(), [], [], new AgentStack([], new InMemoryStateFactory(), new StackTarget('agent-1', 'session-1')));

        return $this->app->make(ClaudeCodeAdapter::class)
            ->callFor($this->payload($tool, $arguments), $this->hookIdentity())
            ->replyWith(fn (HookInput $input, Closure $render) => $render($allowed));
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function payload(string $tool, array $arguments): HookPayload
    {
        return HookPayload::from([
            'session_id' => 'session-redacted',
            'transcript_path' => '/redacted/transcript.jsonl',
            'cwd' => '/work/project',
            'hook_event_name' => 'PreToolUse',
            'tool_name' => $tool,
            'tool_input' => $arguments,
            'tool_use_id' => 'toolu-redacted',
        ]);
    }

    private function assertRefusedWith(string $reason, DriverReply $reply): void
    {
        $this->assertSame(
            ['hookEventName' => 'PreToolUse', 'permissionDecision' => 'deny', 'permissionDecisionReason' => $reason],
            json_decode($reply->stdout, true)['hookSpecificOutput'],
        );
    }

    private function ownRuntimeId(): string
    {
        return AgentRuntime::ofSession($this->target->sessionId)->id;
    }

    private function ownRuntimeFolder(): string
    {
        return self::STATE_FOLDER.'/runtimes/'.$this->ownRuntimeId();
    }

    private function otherRuntimeFolder(): string
    {
        return self::STATE_FOLDER.'/runtimes/'.self::OTHER_RUNTIME;
    }
}
