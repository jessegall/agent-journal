<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Machinery;

use App\Events\Hooks\ContextStarted;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\ReminderContribution;
use App\Models\Inboxes\Inbox;
use App\Values\StackTarget;
use Domain\Chat\Listeners\GreetInNewChat;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;

/**
 * A new chat's agent greets its user by itself: the first start of a session whose chat with a user holds nothing
 * asks its first turn to say who it is and how it can help; a chat that holds a message, or a later context start,
 * asks nothing.
 */
#[TestsMachinery(GreetInNewChat::class)]
final class GreetInNewChatTest extends TestCase
{
    use RefreshHookDatabase;

    private const string AGENT = 'Agent 2';

    public function test_a_start_with_a_new_chat_asks_the_agent_to_greet_its_user_there_once(): void
    {
        $chat = $this->chatOfOwnerAndAgent();

        $reminders = $this->remindersAt(ContextStartType::Start);

        $this->assertCount(1, $reminders);
        $this->assertStringContainsString($chat->id, $reminders[0]);
        $this->assertStringContainsString('Owner', $reminders[0]);
        $this->assertStringContainsString($this->journal->agentCalled(self::AGENT)->name, $reminders[0]);
    }

    public function test_a_chat_that_holds_a_message_or_a_later_context_start_asks_for_no_greeting(): void
    {
        $chat = $this->chatOfOwnerAndAgent();
        $this->assertSame([], $this->remindersAt(ContextStartType::Compact));

        $this->journal->post('Owner', $chat, 'Run the checks.');

        $this->assertSame([], $this->remindersAt(ContextStartType::Start));
    }

    private function chatOfOwnerAndAgent(): Inbox
    {
        $this->journal->owner()->idleAgent(self::AGENT, 'main-agent');

        return $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', self::AGENT)
            ->pairChatOf('Owner', self::AGENT);
    }

    /**
     * @return list<string>
     */
    private function remindersAt(ContextStartType $type): array
    {
        $this->journal->actAs('Owner');
        $reminders = $this->app->make(ReminderContribution::class);

        $this->app->make(GreetInNewChat::class)->handle(new ContextStarted(
            new StackTarget($this->journal->agentCalled('Agent 2')->id, '01m8dd0sct689m9bbtqr335rad'),
            'hook-'.bin2hex(random_bytes(4)),
            $type,
            $reminders,
        ));

        return $reminders->all();
    }
}
