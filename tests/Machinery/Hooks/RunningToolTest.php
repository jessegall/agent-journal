<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Actors\Contracts\AgentTexts;
use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\Enums\RewriteSupport;
use App\Agents\Drivers\Enums\ToolAllowance;
use App\Agents\Drivers\Hooks\DriverReplies;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Agents\Enums\AccessType;
use App\Agents\Inputs\Values\FileChange;
use App\Agents\Inputs\Values\FileChanges;
use App\Agents\Inputs\Values\PromptDetails;
use App\Agents\Inputs\Values\StopDetails;
use App\Engine\Enums\NoSubject;
use App\Events\Hooks\RunningToolChanged;
use App\Files\Enums\FileOperation;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Pipes\Answer\RecordRunningTool;
use App\Models\Agents\AgentRunningTool;
use App\Processes\Enums\ShellDialect;
use App\Stacks\HookAnswer;
use App\Stacks\References\StateReference;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use App\Support\StackOperationDeadline;
use App\Values\ToolLine;
use App\Values\Operation;
use App\Values\ResourceRequest;
use Closure;
use Illuminate\Support\Facades\Event;
use RuntimeException;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\CommittedHookStack;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * Each hook call keeps the agent's running-tool row as the chat line names it: a call let run starts it under the
 * line as written, a finished call finishes it, a new turn clears it, and a denied call, a replay and a failed hook
 * change nothing and raise nothing.
 */
#[TestsMachinery(RecordRunningTool::class)]
final class RunningToolTest extends TestCase
{
    use CommittedHookStack;

    public function test_an_admitted_shell_line_is_named_as_the_agent_wrote_it_and_raises_one_fact(): void
    {
        Event::fake([RunningToolChanged::class]);

        $this->answer($this->shellCall('git status', 'call-1'));

        $this->assertLine(ToolLine::shell('git status')->text, true);
        Event::assertDispatchedTimes(RunningToolChanged::class, 1);
        Event::assertDispatched(
            RunningToolChanged::class,
            fn (RunningToolChanged $fact) => $fact->line === 'Bash git status' && $fact->isRunning,
        );
    }

    public function test_a_denied_line_leaves_the_line_as_it_was(): void
    {
        $this->journal->pushState($this->target, new StateReference('guide', NoSubject::None));
        $this->answer($this->shellCall('git status', 'call-1'));
        Event::fake([RunningToolChanged::class]);

        $this->answer($this->shellCall('acme publish --everything', 'call-2'));

        $this->assertLine(ToolLine::shell('git status')->text, true);
        Event::assertNotDispatched(RunningToolChanged::class);
    }

    public function test_a_line_a_state_rewrites_is_named_by_what_runs(): void
    {
        $this->journal->pushState($this->target, $this->rewriting());

        $this->answer($this->shellCall('composer test', 'call-1'));

        $this->assertLine(ToolLine::shell('git status')->text, true);
    }

    public function test_a_file_read_names_its_file_and_an_edit_its_files(): void
    {
        $readBy = new Operation(
            'claude',
            'claude:Read',
            [AccessType::Read],
            [ResourceRequest::path('/Users/x/p/src/Chat/Pages.php')],
            [],
            1,
        );
        $read = new ToolRequested($this->identity('call-1'), $readBy);
        $this->answer($read);
        $this->assertLine(ToolLine::operation($readBy)->text, true);

        $changes = new FileChanges([new FileChange('app/Models/Task.php', FileOperation::Edit)]);
        $edit = new FileEditRequested(
            $this->identity('call-2'),
            $changes,
        );
        $this->answer($edit);
        $this->assertLine(ToolLine::files($changes)->text, true);
    }

    public function test_a_finished_call_keeps_its_line_no_longer_running(): void
    {
        $this->answer($this->shellCall('git status', 'call-1'));

        $this->answer($this->finished('call-2'));

        $this->assertLine(ToolLine::shell('git status')->text, false);
    }

    public function test_a_stop_and_a_prompt_clear_the_line_and_a_finish_after_a_clear_changes_nothing(): void
    {
        $this->answer($this->shellCall('git status', 'call-1'));
        $this->answer(new StopRequested($this->identity('call-2'), new StopDetails('turn-1', false, '')));
        $this->assertLine(null, false);

        $this->answer($this->shellCall('git status', 'call-3'));
        $this->answer(new PromptSubmitted($this->identity('call-4'), new PromptDetails('p', 'Go on.', 'p')));
        $this->assertLine(null, false);

        Event::fake([RunningToolChanged::class]);
        $this->answer($this->finished('call-5'));
        $this->assertLine(null, false);
        Event::assertNotDispatched(RunningToolChanged::class);
    }

    public function test_a_replayed_call_writes_nothing_again(): void
    {
        $this->answer($this->shellCall('git status', 'call-1'));
        Event::fake([RunningToolChanged::class]);

        $this->answer($this->shellCall('git status', 'call-1'));

        Event::assertNotDispatched(RunningToolChanged::class);
    }

    public function test_a_hook_that_fails_keeps_no_line_and_raises_nothing(): void
    {
        Event::fake([RunningToolChanged::class]);

        try {
            $failingReply = fn () => throw new RuntimeException('The reply could not be rendered.');
            $this->answer($this->shellCall('git status', 'call-1'), $failingReply);
            $this->fail('The hook did not fail.');
        } catch (RuntimeException) {
            $this->assertSame(0, AgentRunningTool::query()->count());
            Event::assertNotDispatched(RunningToolChanged::class);
        }
    }

    private function assertLine(string|null $line, bool $isRunning): void
    {
        $tool = AgentRunningTool::findShownOf($this->target->agentId)->get();

        $this->assertSame([$line, $isRunning], [$tool->line, $tool->is_running]);
    }

    /**
     * @param  (Closure(HookAnswer, AgentTexts): DriverReply)|null  $render
     */
    private function answer(HookInput $input, Closure|null $render = null): void
    {
        $this->callAs($input->identity()->hookId);
        $this->machine()->answer(
            $input,
            $this->allCapabilities(),
            new StackOperationDeadline(3000),
            $render ?? fn (HookAnswer $answer, AgentTexts $texts) => $this->reply($input, $answer, $texts),
        );
    }

    private function reply(HookInput $input, HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        return match (true) {
            $input instanceof ShellCommandRequested => DriverReplies::shell(
                $answer,
                new DriverToolInput(['command' => $input->command->source]),
                RewriteSupport::WithoutApproval,
                ToolAllowance::AllowDecision,
                $texts,
            ),
            $input instanceof StopRequested => DriverReplies::stop($answer, $texts),
            $input instanceof PromptSubmitted => DriverReplies::prompt($answer, $texts),
            default => DriverReplies::allowTool($answer->shownContext($texts), ToolAllowance::AllowDecision),
        };
    }

    private function shellCall(string $line, string $callId): ShellCommandRequested
    {
        return new ShellCommandRequested(
            $this->identity($callId),
            new ListedCommandParser()->parse($line, ShellDialect::Bash),
        );
    }

    private function finished(string $callId): ToolFinished
    {
        return new ToolFinished(
            $this->identity($callId),
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => 'git status'])),
        );
    }

    private function identity(string $callId): HookIdentity
    {
        return TestActors::hookIdentity(1, 10, $callId, self::inputDigest());
    }

    private function allCapabilities(): DriverCapabilities
    {
        return new DriverCapabilities(
            'Test driver',
            'every tool, prompt and stop reply',
            ['onShellCommand', 'onFileEdit', 'onToolRequested', 'onToolFinished', 'onPrompt', 'onStop'],
            RewriteSupport::WithoutApproval,
        );
    }
}
