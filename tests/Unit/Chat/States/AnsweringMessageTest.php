<?php

declare(strict_types=1);

namespace Tests\Unit\Chat\States;

use App\Domain\Chat\MessageWork;
use App\Domain\Chat\MessageWorkState;
use App\Domain\Chat\States\AnsweringMessage;
use App\Domain\Hooks\Decisions\Denied;
use App\Domain\Hooks\Decisions\SimpleChange;
use App\Domain\Hooks\Decisions\StopPrevented;
use App\Domain\Hooks\Inputs\CommandEffect;
use App\Domain\Hooks\Inputs\CommandKind;
use App\Domain\Hooks\Inputs\CommandPart;
use App\Domain\Hooks\Inputs\FileChange;
use App\Domain\Hooks\Inputs\FileChanges;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\ParseOutcome;
use App\Domain\Hooks\Inputs\ShellCommand;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\HookInputs;

final class AnsweringMessageTest extends TestCase
{
    /**
     * @return iterable<string, array{ShellCommand}>
     */
    public static function commandsThatMayChangeFiles(): iterable
    {
        yield 'a write' => [self::command(ParseOutcome::Complete, CommandEffect::ChangesFiles)];
        yield 'an unknown program' => [self::command(ParseOutcome::Complete, CommandEffect::Unknown)];
        yield 'a dynamic expansion' => [self::command(ParseOutcome::DynamicExpansion, CommandEffect::ReadsOnly)];
        yield 'an unparsed line' => [self::command(ParseOutcome::Unparsed, CommandEffect::ReadsOnly)];
    }

    /**
     * @return iterable<string, array{MessageWorkState}>
     */
    public static function settledStates(): iterable
    {
        yield 'answered' => [MessageWorkState::Answered];
        yield 'dismissed' => [MessageWorkState::Dismissed];
    }

    public function test_the_session_start_adds_the_reply_instruction_and_delegates(): void
    {
        $decision = HookInputs::all()['session start']->answerBy($this->unanswered());

        $this->assertTrue($decision->isDelegating());
        $this->assertSame([$this->message()->replyInstruction()], $decision->context);
    }

    public function test_an_unanswered_message_prevents_the_stop(): void
    {
        $decision = $this->unanswered()->onStop(new StopRequested($this->hook(), new StopDetails('turn-1', false)));

        $this->assertInstanceOf(StopPrevented::class, $decision->answer);
        $this->assertStringContainsString('journal message reply 95', $decision->refusalReason());
        $this->assertSame(SimpleChange::Keep, $decision->change);
    }

    #[DataProvider('commandsThatMayChangeFiles')]
    public function test_a_command_that_may_change_files_is_denied_until_the_message_is_answered(ShellCommand $command): void
    {
        $decision = $this->unanswered()->onShellCommand(new ShellCommandRequested($this->hook(), $command));

        $this->assertInstanceOf(Denied::class, $decision->answer);
        $this->assertStringContainsString('Message 95 waits for your answer', $decision->refusalReason());
    }

    public function test_a_read_only_command_is_delegated(): void
    {
        $command = self::command(ParseOutcome::Complete, CommandEffect::ReadsOnly);

        $this->assertTrue($this->unanswered()->onShellCommand(new ShellCommandRequested($this->hook(), $command))->isDelegating());
    }

    public function test_a_file_edit_is_denied_until_the_message_is_answered(): void
    {
        $edit = new FileEditRequested($this->hook(), new FileChanges([new FileChange('app/Domain/Domain.php', FileOperation::Edit)]));

        $this->assertInstanceOf(Denied::class, $this->unanswered()->onFileEdit($edit)->answer);
    }

    #[DataProvider('settledStates')]
    public function test_a_settled_message_is_finished(MessageWorkState $state): void
    {
        $this->assertTrue((new AnsweringMessage(new MessageWork(95, $state)))->isFinished());
        $this->assertFalse($this->unanswered()->isFinished());
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_a_settled_message_blocks_no_hook(HookInput $input): void
    {
        $answered = new AnsweringMessage(new MessageWork(95, MessageWorkState::Answered));

        $this->assertNotContains($input->answerBy($answered)->answerKind()->value, ['deny', 'prevent_stop']);
    }

    public function test_answering_leaves_the_message_snapshot_as_it_was(): void
    {
        $message = $this->message();
        $state = new AnsweringMessage($message);

        foreach (HookInputs::all() as $input) {
            $input->answerBy($state);
        }

        $this->assertSame(MessageWorkState::Unanswered, $message->state);
    }

    private static function command(ParseOutcome $outcome, CommandEffect $effect): ShellCommand
    {
        return new ShellCommand('tool run', ShellDialect::Bash, $outcome, [new CommandPart('tool', ['run'], $effect, CommandKind::Ordinary)]);
    }

    private function message(): MessageWork
    {
        return new MessageWork(95, MessageWorkState::Unanswered);
    }

    private function unanswered(): AnsweringMessage
    {
        return new AnsweringMessage($this->message());
    }

    private function hook(): HookIdentity
    {
        return new HookIdentity(1, 2, 'hook-1', 'digest');
    }
}
