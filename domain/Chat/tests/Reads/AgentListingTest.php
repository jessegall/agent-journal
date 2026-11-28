<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Support\AgentListing;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The chat list shows each agent with the viewer's unread messages in its chat and when that chat last moved; an
 * agent the viewer has no chat with shows none of either.
 */
final class AgentListingTest extends TestCase
{
    use CommitsHookRows;

    /**
     * None by name: a sent message commits under repeatable read, and what the test wrote is emptied when it ends.
     */
    protected const array TABLES = [];

    protected function tearDown(): void
    {
        CarbonImmutable::setTestNow();

        parent::tearDown();
    }

    public function test_an_agent_shows_the_viewers_unread_messages_and_when_its_chat_last_moved(): void
    {
        $this->journal->owner()->agent('Planner')->agent('Reviewer');
        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');

        CarbonImmutable::setTestNow('2026-11-30 09:00:00');
        $this->journal->runAs('Owner', new SendMessageCommand($chat->id, 'Run the checks.'));
        CarbonImmutable::setTestNow('2026-11-30 09:05:00');
        $this->journal->runAs('Planner', new SendMessageCommand($chat->id, 'All green.'));
        $this->journal->runAs('Planner', new SendMessageCommand($chat->id, 'Shall I merge?'));
        $this->journal->actAs('Owner');

        $planner = $this->listed('Planner');
        $reviewer = $this->listed('Reviewer');

        $this->assertSame(
            [2, true, 0, null, false],
            [
                $planner->unreadCount,
                $planner->lastActiveAt !== null
                    && CarbonImmutable::parse($planner->lastActiveAt)->equalTo('2026-11-30 09:05:00'),
                $reviewer->unreadCount,
                $reviewer->lastActiveAt,
                $reviewer->waitsOnYou,
            ],
        );
    }

    private function listed(string $name): AgentOptionData
    {
        $id = $this->journal->actorCalled($name)->id;

        foreach ($this->app->make(AgentListing::class)->visible() as $agent) {
            if ($agent->id === $id) {
                return $agent;
            }
        }

        $this->fail("{$name} is not listed.");
    }
}
