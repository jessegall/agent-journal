<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Enums\AnswerType;
use App\Enums\DismissalType;
use App\Events\ChatMessageAccepted;
use App\Events\ChatMessageOffered;
use App\Events\MessageAnswered;
use App\Events\MessageClaimed;
use App\Events\MessageClaimReleased;
use App\Events\MessageDismissed;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\Decisions\Decision;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\StateLoading\RegisteredStateType;
use App\Support\StateLoading\StateBuilder;
use App\Support\StateLoading\StateValues;
use App\Support\States\AnsweringMessageState;
use App\Values\AnswerBudget;
use Domain\Chat\Events\MessageReactionAdded;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestText;
use Tests\TestCase;

/**
 * The answering state keeps its own list and its own count: a message offered to the agent or claimed by it
 * joins the list when the state hears of it, each tool use is one off the budget, and the agent's reply, its reaction
 * or its closing words finish it; a message answered elsewhere or released goes off the list.
 */
final class AnsweringMessageStateTest extends TestCase
{
    private const string CHAT = 'chat-1';

    private const string FIRST = 'message-1';

    private const string SECOND = 'message-2';

    private const string CLOSING_WORDS = 'It-is-4.';

    private const int BUDGET = 2;

    public function test_a_state_with_nothing_waiting_is_finished_and_says_nothing(): void
    {
        $state = $this->state();

        $this->assertTrue($state->isFinished());
        $this->assertTrue($state->instruction()->isEmpty());
        $this->assertTrue($state->workPermission()->allowed);
        $this->assertSame(AnswerType::Delegate, $state->onShellCommand($this->shell())->answerType());
        $this->assertSame(AnswerType::Delegate, $this->decisionOf($state->onStop($this->stop()))->answerType());
    }

    public function test_messages_sent_in_its_chat_pile_up_in_the_one_state_and_others_are_not_its_own(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);
        $state->onMessageOffered(new ChatMessageOffered('another-chat', 'message-9', $this->agent()));
        $state->onMessageOffered(new ChatMessageOffered(self::CHAT, 'message-8', TestActors::agentIdentity(3)));
        $state->onMessageOffered(new ChatMessageOffered(self::CHAT, self::SECOND, $this->agent()));

        $this->assertSame([self::FIRST, self::SECOND], $this->valuesOf($state)['waitingIds']);
        $this->assertStringContainsString(self::FIRST, TestText::words($state->instruction()->get()));
    }

    public function test_each_tool_use_is_one_off_the_budget_and_after_it_every_call_is_refused(): void
    {
        $state = $this->waiting(self::FIRST);

        $state->onToolFinished($this->toolFinished());

        $this->assertSame(1, $this->valuesOf($state)['toolUses']);
        $this->assertSame(AnswerType::Delegate, $state->onShellCommand($this->shell())->answerType());

        $state->onToolFinished($this->toolFinished());

        $this->assertSame(self::BUDGET, $this->valuesOf($state)['toolUses']);
        $this->assertSame(AnswerType::Deny, $state->onShellCommand($this->shell())->answerType());
        $this->assertFalse($state->workPermission()->allowed);
        $this->assertSame(['message_id' => self::FIRST], $state->workPermission()->recovery?->arguments);
    }

    public function test_the_agents_own_message_in_the_chat_answers_everything_that_waited(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);

        $state->onChatAnswer(new ChatMessageAccepted('reply-1', TestActors::userIdentity(1), self::CHAT));
        $state->onChatAnswer(new ChatMessageAccepted('reply-2', TestActors::agentIdentity(2), 'another-chat'));
        $state->onChatAnswer(new ChatMessageAccepted('reply-4', TestActors::agentIdentity(3), self::CHAT));

        $this->assertFalse($state->isFinished());

        $state->onChatAnswer(new ChatMessageAccepted('reply-3', TestActors::agentIdentity(2), self::CHAT));

        $this->assertTrue($state->isFinished());
        $this->assertSame([], $this->valuesOf($state)['waitingIds']);
    }

    public function test_a_reaction_of_the_agent_answers_too(): void
    {
        $state = $this->waiting(self::FIRST);

        $state->onChatAnswer(new MessageReactionAdded(self::CHAT, self::FIRST, TestActors::userIdentity(1)));

        $this->assertFalse($state->isFinished());

        $state->onChatAnswer(new MessageReactionAdded(self::CHAT, self::FIRST, TestActors::agentIdentity(2)));

        $this->assertTrue($state->isFinished());
    }

    public function test_a_turn_that_ends_on_words_posts_them_in_the_chat_as_a_message_and_finishes(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);

        $post = $state->onStop($this->stop(closingWords: self::CLOSING_WORDS));

        $this->assertInstanceOf(PostChatMessageCommand::class, $post);
        $this->assertSame([self::CHAT, self::CLOSING_WORDS], [$post->inboxId, $post->body]);
        $this->assertTrue($state->isFinished());
    }

    public function test_a_turn_that_ends_on_nothing_is_sent_back_once_to_answer(): void
    {
        $state = $this->waiting(self::FIRST);

        $first = $this->decisionOf($state->onStop($this->stop()));
        $again = $this->decisionOf($state->onStop($this->stop(isAfterRefusedStop: true)));

        $this->assertSame([AnswerType::Deny, AnswerType::Delegate], [$first->answerType(), $again->answerType()]);
        $this->assertSame(1, $this->valuesOf($state)['refusedStops']);
        $this->assertFalse($state->isFinished());
    }

    public function test_a_new_message_sets_the_refused_stops_back_and_the_next_empty_stop_is_refused_again(): void
    {
        $state = $this->waiting(self::FIRST);
        $state->onStop($this->stop());

        $state->onMessageOffered(new ChatMessageOffered(self::CHAT, self::SECOND, $this->agent()));

        $this->assertSame(0, $this->valuesOf($state)['refusedStops']);
        $this->assertSame(AnswerType::Deny, $this->decisionOf($state->onStop($this->stop()))->answerType());
    }

    public function test_what_it_keeps_comes_back_from_its_saved_values(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND);
        $state->onToolFinished($this->toolFinished());
        $this->app->instance(AnswerBudget::class, new AnswerBudget(self::BUDGET));

        $restored = $this->app->make(StateBuilder::class)->build(
            RegisteredStateType::of(AnsweringMessageState::class),
            StateValues::of($state),
        );

        $this->assertSame(StateValues::of($state), StateValues::of($restored));
        $this->assertSame(TestText::words($state->instruction()->get()), TestText::words($restored->instruction()->get()));
    }

    public function test_a_message_it_takes_up_in_its_chat_joins_the_list(): void
    {
        $state = $this->waiting(self::FIRST);

        $state->onMessageOffered(new MessageClaimed(self::SECOND, self::CHAT, $this->agent()));
        $state->onMessageOffered(new MessageClaimed('message-9', 'another-chat', $this->agent()));

        $this->assertSame([self::FIRST, self::SECOND], $this->valuesOf($state)['waitingIds']);
    }

    public function test_a_message_answered_elsewhere_dismissed_or_released_goes_off_and_the_last_one_finishes_it(): void
    {
        $state = $this->waiting(self::FIRST, self::SECOND, 'message-3');

        $state->onMessageDismissed(new MessageDismissed('message-3', $this->agent(), DismissalType::Declined));
        $this->assertSame([self::FIRST, self::SECOND], $this->valuesOf($state)['waitingIds']);

        $state->onMessageAnswered(new MessageAnswered(self::FIRST, 'reply-1', TestActors::userIdentity(1)));
        $this->assertSame([self::SECOND], $this->valuesOf($state)['waitingIds']);

        $claim = new AssignmentReference(TestIds::of(9), AssigneeIdentity::ofActorIdentity($this->agent()));
        $state->onMessageClaimReleased(new MessageClaimReleased(self::SECOND, $claim));
        $this->assertTrue($state->isFinished());
    }

    private function state(): AnsweringMessageState
    {
        return new AnsweringMessageState(self::CHAT, $this->agent()->id, new AnswerBudget(self::BUDGET));
    }

    private function agent(): ActorIdentity
    {
        return TestActors::agentIdentity(2);
    }

    /**
     * @return array<string, mixed>
     */
    private function valuesOf(AnsweringMessageState $state): array
    {
        return StateValues::of($state);
    }

    private function waiting(string ...$messageIds): AnsweringMessageState
    {
        $state = $this->state();

        foreach ($messageIds as $messageId) {
            $state->onMessageOffered(new ChatMessageOffered(self::CHAT, $messageId, $this->agent()));
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

    private function stop(bool $isAfterRefusedStop = false, string $closingWords = ''): StopRequested
    {
        return new StopRequested(
            new HookIdentity('agent-1', 'session-1', 'hook-1', 'digest'),
            new StopDetails('turn-1', $isAfterRefusedStop, $closingWords),
        );
    }
}
