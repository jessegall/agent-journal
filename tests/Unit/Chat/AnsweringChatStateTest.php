<?php

declare(strict_types=1);

namespace Tests\Unit\Chat;

use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Enums\AnswerType;
use App\Events\ChatMessageAccepted;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Values\AnswerBudget;
use Domain\Chat\Events\MessageAwaitsAnswer;
use Domain\Chat\Events\MessageReactionAdded;
use Domain\Chat\Support\States\AnsweringChatState;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The answering state keeps its own list and its own count (rule 88): a message sent to the agent joins the list
 * when the state hears of it, each tool use is one off the budget, and the agent's reply, its reaction or its closing
 * words finish it.
 */
final class AnsweringChatStateTest extends TestCase
{
    private const string CHAT = 'chat-1';

    private const string FIRST = 'message-1';

    private const string SECOND = 'message-2';

    private const string CLOSING_WORDS = 'It-is-4.';

    private const int BUDGET = 2;

    public function test_a_new_state_holds_nothing_and_says_nothing(): void
    {
        $state = $this->state();

        $this->assertFalse($state->isFinished());
        $this->assertTrue($state->instruction()->isEmpty());
        $this->assertTrue($state->workPermission()->allowed);
        $this->assertSame(AnswerType::Delegate, $state->onShellCommand($this->shell())->answerType());
        $this->assertSame(AnswerType::Delegate, $this->decisionOf($state->onStop($this->stop()))->answerType());
    }

    public function test_messages_sent_in_its_chat_pile_up_in_the_one_state_and_others_are_not_its_own(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);
        $state->onMessageAwaitsAnswer(new MessageAwaitsAnswer('another-chat', 'message-9'));
        $state->onMessageAwaitsAnswer(new MessageAwaitsAnswer(self::CHAT, self::SECOND));

        $this->assertSame([self::FIRST, self::SECOND], $state->ownValues()->waitingIds);
        $this->assertStringContainsString(self::FIRST, $state->instruction()->get());
    }

    public function test_each_tool_use_is_one_off_the_budget_and_after_it_every_call_is_refused(): void
    {
        $state = $this->waiting(self::FIRST);

        $state->onToolFinished($this->toolFinished());

        $this->assertSame(1, $state->ownValues()->toolUses);
        $this->assertSame(AnswerType::Delegate, $state->onShellCommand($this->shell())->answerType());

        $state->onToolFinished($this->toolFinished());

        $this->assertSame(self::BUDGET, $state->ownValues()->toolUses);
        $this->assertSame(AnswerType::Deny, $state->onShellCommand($this->shell())->answerType());
        $this->assertFalse($state->workPermission()->allowed);
        $this->assertSame(['message_id' => self::FIRST], $state->workPermission()->recovery?->arguments);
    }

    public function test_the_agents_own_message_in_the_chat_answers_everything_that_waited(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);

        $state->onChatMessageAccepted(new ChatMessageAccepted('reply-1', TestActors::userIdentity(1), self::CHAT));
        $state->onChatMessageAccepted(new ChatMessageAccepted('reply-2', TestActors::agentIdentity(2), 'another-chat'));

        $this->assertFalse($state->isFinished());

        $state->onChatMessageAccepted(new ChatMessageAccepted('reply-3', TestActors::agentIdentity(2), self::CHAT));

        $this->assertTrue($state->isFinished());
        $this->assertSame([], $state->ownValues()->waitingIds);
    }

    public function test_a_reaction_of_the_agent_answers_too(): void
    {
        $state = $this->waiting(self::FIRST);

        $state->onMessageReactionAdded(new MessageReactionAdded(self::CHAT, self::FIRST, TestActors::userIdentity(1)));

        $this->assertFalse($state->isFinished());

        $state->onMessageReactionAdded(new MessageReactionAdded(self::CHAT, self::FIRST, TestActors::agentIdentity(2)));

        $this->assertTrue($state->isFinished());
    }

    public function test_a_turn_that_ends_on_words_replies_with_them_to_the_oldest_message_and_finishes(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);

        $reply = $state->onStop($this->stop(closingWords: self::CLOSING_WORDS));

        $this->assertInstanceOf(ReplyToMessageCommand::class, $reply);
        $this->assertSame([self::FIRST, self::CLOSING_WORDS], [$reply->messageId, $reply->body]);
        $this->assertTrue($state->isFinished());
    }

    public function test_a_turn_that_ends_on_nothing_is_sent_back_once_to_answer(): void
    {
        $state = $this->waiting(self::FIRST);

        $first = $this->decisionOf($state->onStop($this->stop()));
        $again = $this->decisionOf($state->onStop($this->stop(isContinuation: true)));

        $this->assertSame([AnswerType::Deny, AnswerType::Delegate], [$first->answerType(), $again->answerType()]);
        $this->assertFalse($state->isFinished());
    }

    public function test_what_it_keeps_comes_back_from_its_saved_values(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);
        $state->onToolFinished($this->toolFinished());

        $restored = $this->state();
        $restored->restoreOwnValues($state->ownValues()->toArray());

        $this->assertSame($state->ownValues()->toArray(), $restored->ownValues()->toArray());
        $this->assertSame($state->instruction()->get(), $restored->instruction()->get());
    }

    private function state(): AnsweringChatState
    {
        return new AnsweringChatState(self::CHAT, new AnswerBudget(self::BUDGET));
    }

    private function waiting(string ...$messageIds): AnsweringChatState
    {
        $state = $this->state();

        foreach ($messageIds as $messageId) {
            $state->onMessageAwaitsAnswer(new MessageAwaitsAnswer(self::CHAT, $messageId));
        }

        return $state;
    }

    private function decisionOf(mixed $answer): Decision
    {
        $this->assertInstanceOf(Decision::class, $answer);

        return $answer;
    }

    private function shell(): ShellCommandRequested
    {
        $shell = HookInputs::all()['shell command'];
        $this->assertInstanceOf(ShellCommandRequested::class, $shell);

        return $shell;
    }

    private function toolFinished(): ToolFinished
    {
        $finished = HookInputs::all()['tool finished'];
        $this->assertInstanceOf(ToolFinished::class, $finished);

        return $finished;
    }

    private function stop(bool $isContinuation = false, string $closingWords = ''): StopRequested
    {
        return new StopRequested(
            new HookIdentity('agent-1', 'session-1', 'hook-1', 'digest'),
            new StopDetails('turn-1', $isContinuation, $closingWords),
        );
    }
}
