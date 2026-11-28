<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Unit;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverType;
use App\Models\Drivers\DriverSwitch;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Sessions\StartSessions;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use Domain\Chat\Support\DriverSwitchLines;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;

/**
 * A driver switch writes one line in the chat of the user who asked for it: where the agent moved and what its new
 * session reads, or why the switch failed and that the agent stays on its old driver.
 */
final class DriverSwitchLinesTest extends TestCase
{
    public function test_a_failed_switch_says_why_and_that_the_agent_stays_on_its_old_driver(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: false);

        $this->app->make(DriverSwitchLines::class)->failed($switch, 'Its account must sign in again.');

        $line = $this->linesIn($chat)[0];
        $this->assertStringContainsString('The switch to codex failed: Its account must sign in again.', $line);
        $this->assertStringContainsString('Main agent stays on', $line);
    }

    public function test_a_switch_to_another_program_that_carries_the_chat_over_asks_the_new_session_to_read_it(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: true);

        $this->app->make(DriverSwitchLines::class)->switched($switch);

        $this->assertStringContainsString(
            "the new session reads this chat and the memories. Main agent: read this chat's history",
            $this->linesIn($chat)[0],
        );
    }

    public function test_a_switch_that_starts_clean_says_the_new_session_read_only_the_memories(): void
    {
        [$switch, $chat] = $this->switchOf(carriesConversation: false);

        $this->app->make(DriverSwitchLines::class)->switched($switch);

        $this->assertStringContainsString('the new session read only the memories.', $this->linesIn($chat)[0]);
    }

    /**
     * @return array{DriverSwitch, Inbox}
     */
    private function switchOf(bool $carriesConversation): array
    {
        $this->journal->owner()->idleAgent('Main agent', 'main-agent');
        $agent = $this->journal->agentCalled('Main agent');
        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Main agent')
            ->pairChatOf('Owner', 'Main agent');
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
