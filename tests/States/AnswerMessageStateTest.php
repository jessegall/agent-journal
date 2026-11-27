<?php

declare(strict_types=1);

namespace Tests\States;

use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageSent;
use App\Hooks\Enums\AnswerType;
use App\Models\Messages\Message;
use App\Processes\Contracts\ShellCommandParser;
use App\Stacks\AnswerMessageState;
use App\Stacks\Support\AnswerMessageStateReference;
use App\Stacks\Values\AnswerBudget;
use App\Support\ActorReference;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * The answer message state, driven on the real engine: the agent's own reply or reaction, or leaving the inbox, ends
 * it; each tool use takes one off its budget, and once the budget is spent every write and the stop are refused.
 * It is also the worked example of a state scenario.
 */
#[TestsState(AnswerMessageState::class)]
final class AnswerMessageStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private const string INBOX = 'inbox-1';

    private const string MESSAGE = 'message-1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AnswerBudget::class, new AnswerBudget(2));
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer')->agent('Other');
        $this->journal->pushState('Writer', $this->answering());
    }

    public function test_a_pushed_state_stays_until_its_agent_answers(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->steps(
                [$this->sent($this->journal->actorCalled('Owner'))],
                fn (StateAssert $state) => $state->isLive(),
            )
            ->steps(
                [$this->sent($this->journal->actorCalled('Other'))],
                fn (StateAssert $state) => $state->isLive(),
            )
            ->steps([$this->sent($this->agent())], fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_reply_to_another_message_does_not_answer_it(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering->event(
            new MessageSent('reply-1', self::INBOX, 2, 'message-9', $this->agent()),
            fn (StateAssert $state) => $state->isLive(),
        ));
    }

    public function test_the_agent_leaving_the_inbox_ends_it(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->event(new InboxLeft('inbox-9', $this->agent()), fn (StateAssert $state) => $state->isLive())
            ->event(
                new InboxLeft(self::INBOX, $this->agent()),
                fn (StateAssert $state) => $state->isFinished(),
            ));
    }

    public function test_each_tool_use_takes_one_off_the_budget_and_then_it_refuses_a_write(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->steps([
                SessionHook::toolFinished(),
                SessionHook::shell('composer update'),
            ], fn (StateAssert $state) => $state
                ->where('toolUses', 1)
                ->answers(AnswerType::Delegate))
            ->steps([
                SessionHook::toolFinished(),
                SessionHook::shell('composer update'),
            ], fn (StateAssert $state) => $state
                ->where('toolUses', 2)
                ->answers(AnswerType::Deny))
            ->shell(
                'git status',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            ));
    }

    public function test_a_stop_is_refused_until_it_is_answered(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->stop(fn (StateAssert $state) => $state->answers(AnswerType::Deny))
            ->steps([$this->sent($this->agent())], fn (StateAssert $state) => $state->isFinished()));
    }

    public function test_a_file_edit_passes_until_the_budget_is_spent(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->fileEdit(
                'app/Thing.php',
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            )
            ->steps([
                SessionHook::toolFinished(),
                SessionHook::toolFinished('pwd'),
                SessionHook::fileEdit('app/Thing.php'),
            ], fn (StateAssert $state) => $state->answers(AnswerType::Deny)));
    }

    public function test_a_stop_right_after_a_refused_one_passes(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->stop(fn (StateAssert $state) => $state->answers(AnswerType::Deny))
            ->stopAfterRefusal(
                fn (StateAssert $state) => $state->answers(AnswerType::Delegate),
            ));
    }

    public function test_a_tick_leaves_it_as_it_was(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering->tick(fn (StateAssert $state) => $state->isLive()));
    }

    /**
     * The state of a message held in memory only: it keeps what it needs of the message in its own values.
     */
    private function answering(): AnswerMessageStateReference
    {
        $message = new Message();
        $message->id = self::MESSAGE;
        $message->number = 1;
        $message->inbox_id = self::INBOX;
        $writer = $this->journal->agentCalled('Writer')->id;

        return AnswerMessageStateReference::forMessage($message, $writer);
    }

    private function sent(ActorReference $sender): MessageSent
    {
        return new MessageSent('reply-1', self::INBOX, 2, self::MESSAGE, $sender);
    }

    private function agent(): ActorReference
    {
        return $this->journal->actorCalled('Writer');
    }
}
