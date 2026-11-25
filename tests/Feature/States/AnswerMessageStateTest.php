<?php

declare(strict_types=1);

namespace Tests\Feature\States;

use App\Enums\Hooks\AnswerType;
use App\Enums\Hooks\ToolOutcome;
use App\Events\Inboxes\InboxLeft;
use App\Events\Messages\MessageSent;
use App\Models\Messages\Message;
use App\Support\ActorIdentity;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\ToolResult;
use App\Support\States\Support\AnswerMessageStateReference;
use App\Values\AnswerBudget;
use Tests\Support\StateScenario;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TestsStates;
use Tests\TestCase;

/**
 * The answer message state, driven on the real engine: the agent's own reply or reaction, or leaving the inbox, ends
 * it; each tool use takes one off its budget, and once the budget is spent every write and the stop are refused.
 * It is also the worked example of a state scenario.
 */
final class AnswerMessageStateTest extends TestCase
{
    use TestsStates;

    private const string INBOX = 'inbox-1';

    private const string MESSAGE = 'message-1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AnswerBudget::class, new AnswerBudget(2));
    }

    public function test_a_pushed_state_stays_until_its_agent_answers(): void
    {
        $scenario = $this->answering();

        $scenario->given($this->sent(TestActors::userIdentity(1)))->assertActive();
        $scenario->given($this->sent(TestActors::agentIdentity(3)))->assertActive();
        $scenario->given($this->sent($this->agent()))->assertPopped();
    }

    public function test_a_reply_to_another_message_does_not_answer_it(): void
    {
        $this->answering()
            ->given(new MessageSent('reply-1', self::INBOX, 2, 'message-9', $this->agent()))
            ->assertActive();
    }

    public function test_the_agent_leaving_the_inbox_ends_it(): void
    {
        $this->answering()
            ->given(new InboxLeft('inbox-9', $this->agent()))
            ->assertActive()
            ->given(new InboxLeft(self::INBOX, $this->agent()))
            ->assertPopped();
    }

    public function test_each_tool_use_takes_one_off_the_budget_and_then_it_refuses_a_write(): void
    {
        $scenario = $this->answering()->given($this->toolFinished());

        $this->assertSame(1, $scenario->values()['toolUses']);
        $this->assertSame(AnswerType::Delegate, $scenario->given($this->shell('composer update'))->lastStateAnswer());

        $scenario->given($this->toolFinished());

        $this->assertSame(2, $scenario->values()['toolUses']);
        $this->assertSame(AnswerType::Deny, $scenario->given($this->shell('composer update'))->lastStateAnswer());
        $this->assertSame(AnswerType::Delegate, $scenario->given($this->shell('git status'))->lastStateAnswer());
    }

    public function test_a_stop_is_refused_until_it_is_answered(): void
    {
        $scenario = $this->answering();

        $this->assertSame(AnswerType::Deny, $scenario->given($this->stop())->lastStateAnswer());

        $scenario->given($this->sent($this->agent()))->assertPopped();
    }

    public function test_a_tick_leaves_it_as_it_was(): void
    {
        $this->answering()->given(StateScenario::tick())->assertActive();
    }

    private function answering(): StateScenario
    {
        $message = new Message();
        $message->id = self::MESSAGE;
        $message->number = 1;
        $message->inbox_id = self::INBOX;

        return $this->scenario(AnswerMessageStateReference::forMessage($message, TestIds::of(1)));
    }

    private function sent(ActorIdentity $sender): MessageSent
    {
        return new MessageSent('reply-1', self::INBOX, 2, self::MESSAGE, $sender);
    }

    private function agent(): ActorIdentity
    {
        return TestActors::agentIdentity(1);
    }

    private function toolFinished(): ToolFinished
    {
        return new ToolFinished(
            TestActors::hookIdentity(1, 10, 'call-1', self::inputDigest()),
            new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => 'ls'])),
        );
    }
}
