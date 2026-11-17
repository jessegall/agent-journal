<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks;

use App\Domain\Hooks\Inputs\CompactionDetails;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\FileChange;
use App\Domain\Hooks\Inputs\FileChanges;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\PromptDetails;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionEndDetails;
use App\Domain\Hooks\Inputs\SessionEnded;
use App\Domain\Hooks\Inputs\SessionEndReason;
use App\Domain\Hooks\Inputs\SessionStartDetails;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\SessionStartSource;
use App\Domain\Hooks\Inputs\ShellCommand;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;
use App\Domain\Hooks\Inputs\ToolOutcome;
use App\Domain\Hooks\Inputs\ToolResult;
use App\Domain\Hooks\States\AgentState;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

final class HookInputTest extends TestCase
{
    /**
     * @return iterable<string, array{HookInput, string}>
     */
    public static function inputs(): iterable
    {
        $hook = new HookIdentity(1, 2, 'hook-1', 'digest');

        yield 'session start' => [new SessionStarted($hook, new SessionStartDetails('vendor-1', SessionStartSource::Startup)), 'onSessionStart'];
        yield 'prompt' => [new PromptSubmitted($hook, new PromptDetails('prompt-1', 'Build the plan.')), 'onPrompt'];
        yield 'shell command' => [new ShellCommandRequested($hook, new ShellCommand('composer test', ['composer test'])), 'onShellCommand'];
        yield 'file edit' => [new FileEditRequested($hook, new FileChanges([new FileChange('app/Domain/Domain.php', FileOperation::Edit)])), 'onFileEdit'];
        yield 'stop' => [new StopRequested($hook, new StopDetails('turn-1', false)), 'onStop'];
        yield 'compaction' => [new ContextCompacted($hook, new CompactionDetails(2)), 'onCompaction'];
        yield 'tool finished' => [new ToolFinished($hook, new ToolResult('Bash', ToolOutcome::Succeeded)), 'onToolFinished'];
        yield 'session end' => [new SessionEnded($hook, new SessionEndDetails(SessionEndReason::Exit)), 'onSessionEnd'];
    }

    #[DataProvider('inputs')]
    public function test_each_input_asks_the_state_for_its_own_hook_method(HookInput $input, string $method): void
    {
        $recording = new RecordingState;
        $plainState = new class extends AgentState {};

        $this->assertSame($method, $input->methodName());
        $this->assertSame('allow', $input->answerBy($recording)->answerLabel());
        $this->assertSame([$method], $recording->askedMethods);
        $this->assertSame('delegate', $input->answerBy($plainState)->answerLabel());
    }

    public function test_an_input_keeps_the_identity_it_was_given(): void
    {
        $hook = new HookIdentity(7, 9, 'hook-7', 'digest-7');

        $this->assertSame($hook, (new StopRequested($hook, new StopDetails('turn-7', true)))->identity());
    }
}
