<?php

declare(strict_types=1);

namespace Tests\Feature\States;

use App\Contracts\Processes\ShellCommandParser;
use App\Enums\Hooks\AnswerType;
use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Values\AnswerBudget;
use Tests\Fixtures\Hooks\ListedCommandParser;
use Tests\Support\CommitsHookRows;
use Tests\Support\ScenarioTick;
use Tests\Support\Seeding\SessionHooks;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
use Tests\TestCase;

/**
 * The answer message state, driven on the real engine: the agent's own reply or reaction, or leaving the inbox, ends
 * it; each tool use takes one off its budget, and once the budget is spent every write and the stop are refused.
 * It is also the worked example of a state scenario.
 */
final class AnswerMessageStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private const string INBOX = 'inbox-1';

    private const string MESSAGE = 'message-1';

    private SessionHooks $hooks;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AnswerBudget::class, new AnswerBudget(2));
        $this->app->scoped(ShellCommandParser::class, fn () => new ListedCommandParser());
        $this->journal->owner()->agent('Writer')->agent('Other');
        $this->hooks = $this->journal->hooksFor($this->journal->sessionOf('Writer'));
    }

    public function test_a_pushed_state_stays_until_its_agent_answers(): void
    {
        $this->answering()
            ->given(
                $this->sent($this->journal->actorCalled('Owner')),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                $this->sent($this->journal->actorCalled('Other')),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given($this->sent($this->agent()), fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_reply_to_another_message_does_not_answer_it(): void
    {
        $this->answering()->given(
            new MessageSent('reply-1', self::INBOX, 2, 'message-9', $this->agent()),
            fn (StateObservation $state) => $state->assertLive(),
        );
    }

    public function test_the_agent_leaving_the_inbox_ends_it(): void
    {
        $this->answering()
            ->given(new InboxLeft('inbox-9', $this->agent()), fn (StateObservation $state) => $state->assertLive())
            ->given(
                new InboxLeft(self::INBOX, $this->agent()),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    public function test_each_tool_use_takes_one_off_the_budget_and_then_it_refuses_a_write(): void
    {
        $this->answering()
            ->given([
                $this->hooks->toolFinished(),
                $this->hooks->shell('composer update'),
            ], function (StateObservation $state) {
                $state->assertValue('toolUses', 1);
                $state->assertStateAnswer(AnswerType::Delegate);
            })
            ->given([
                $this->hooks->toolFinished(),
                $this->hooks->shell('composer update'),
            ], function (StateObservation $state) {
                $state->assertValue('toolUses', 2);
                $state->assertStateAnswer(AnswerType::Deny);
            })
            ->given(
                $this->hooks->shell('git status'),
                fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Delegate),
            );
    }

    public function test_a_stop_is_refused_until_it_is_answered(): void
    {
        $this->answering()
            ->given($this->hooks->stop(), fn (StateObservation $state) => $state->assertStateAnswer(AnswerType::Deny))
            ->given($this->sent($this->agent()), fn (StateObservation $state) => $state->assertFinished());
    }

    public function test_a_tick_leaves_it_as_it_was(): void
    {
        $this->answering()->given(new ScenarioTick(), fn (StateObservation $state) => $state->assertLive());
    }

    /**
     * The state of a message held in memory only: it keeps what it needs of the message in its own values.
     */
    private function answering(): StateHandle
    {
        $message = new Message();
        $message->id = self::MESSAGE;
        $message->number = 1;
        $message->inbox_id = self::INBOX;
        $writer = $this->journal->agentCalled('Writer')->id;

        return $this->journal->pushState(
            $this->journal->sessionOf('Writer'),
            AnswerMessageStateReference::forMessage($message, $writer),
        );
    }

    private function sent(ActorIdentity $sender): MessageSent
    {
        return new MessageSent('reply-1', self::INBOX, 2, self::MESSAGE, $sender);
    }

    private function agent(): ActorIdentity
    {
        return $this->journal->actorCalled('Writer');
    }
}
