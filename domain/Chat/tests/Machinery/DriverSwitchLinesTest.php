<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Machinery;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Sessions\StartSessions;
use App\Support\ActorReference;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use Domain\Chat\Support\DriverSwitchLines;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;

/**
 * A driver switch writes one line in the chat of the user who asked for it: where the agent moved and what its new
 * session reads, or why the switch failed and that the agent stays on its old driver.
 */
#[TestsMachinery(DriverSwitchLines::class)]
final class DriverSwitchLinesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    private const string AGENT = 'Main agent';

    public function test_a_failed_switch_says_why_and_that_the_agent_stays_on_its_old_driver(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: false);

        $reason = 'Its account must sign in again.';
        $this->app->make(DriverSwitchLines::class)->failed($switch, $reason);

        $message = Message::query()->inInbox($chat->id)->sole();
        $this->assertEquals(ActorReference::system(), $message->author());
        $line = $message->body;
        $this->assertStringContainsString($switch->target_family, $line);
        $this->assertStringContainsString($reason, $line);
        $this->assertStringContainsString($this->journal->agentCalled(self::AGENT)->name, $line);
        $session = AgentSession::query()->findOrFail($switch->expected_session_id);
        $this->assertStringContainsString($session->driver_label, $line);
    }

    public function test_a_switch_to_another_program_that_carries_the_chat_over_asks_the_new_session_to_read_it(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: true);

        $this->app->make(DriverSwitchLines::class)->switched($switch);

        $this->assertStringContainsString(
            $this->journal->agentCalled(self::AGENT)->name,
            $this->linesIn($chat)[0],
        );

        $this->assertStringContainsString('history', $this->linesIn($chat)[0]);
        $this->assertStringContainsString('memories', $this->linesIn($chat)[0]);
    }

    public function test_a_switch_that_starts_clean_says_the_new_session_read_only_the_memories(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: false);

        $this->app->make(DriverSwitchLines::class)->switched($switch);

        $this->assertStringContainsString('memories', $this->linesIn($chat)[0]);
        $this->assertStringNotContainsString('history', $this->linesIn($chat)[0]);
    }

    /**
     * @return array{DriverSwitch, Inbox}
     */
    private function switchOf(bool $carriesConversation): array
    {
        $this->journal->owner()->idleAgent(self::AGENT, 'main-agent');
        $agent = $this->journal->agentCalled(self::AGENT);

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', self::AGENT)
            ->pairChatOf('Owner', self::AGENT);

        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $switch = DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $session,
            0,
            new DriverSwitchTarget(
                DefaultDrivers::CODEX,
                DriverType::Headless,
                new ChosenAccount(strtolower((string) Str::ulid()), 0),
                null,
                false,
                'gpt-5',
                $carriesConversation,
            ),
            $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless),
            $this->journal->actorCalled('Owner')->id,
        );

        return [
            $switch,
            $chat,
        ];
    }

    /**
     * @return list<string>
     */
    private function linesIn(Inbox $chat): array
    {
        return array_values(array_map(strval(...), Message::query()->inInbox($chat->id)->pluck('body')->all()));
    }
}
