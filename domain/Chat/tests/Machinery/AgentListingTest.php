<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Machinery;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Agents\Agent;
use Carbon\CarbonImmutable;
use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Support\AgentListing;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\CommitsHookRows;

/**
 * The chat list shows each agent with the viewer's unread messages in its chat and when that chat last moved; an
 * agent the viewer has no chat with shows none of either. It is read a page at a time, the most recently moved chats
 * first, each page in the same few grouped reads.
 */
#[TestsMachinery(AgentListing::class)]
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

    public function test_the_first_page_holds_the_newest_active_agents_and_the_next_follows_it_in_as_many_reads(): void
    {
        $this->journal->owner();
        $chats = $this->journal->fixtures(ChatFixtures::class);

        foreach (range(1, AgentListing::PAGE_SIZE + 2) as $number) {
            $name = sprintf('Agent %02d', $number);
            $this->journal->idleAgent($name);
            $chats->pairChatBetween('Owner', $name);
        }

        $messages = [
            '2026-11-30 09:00:00' => 'Agent 05',
            '2026-11-30 09:10:00' => 'Agent 17',
            '2026-11-30 09:05:00' => 'Agent 09',
        ];

        foreach ($messages as $at => $name) {
            CarbonImmutable::setTestNow($at);
            $this->journal->runAs('Owner', new SendMessageCommand($chats->pairChatOf('Owner', $name)->id, 'Status?'));
        }

        $this->journal->actAs('Owner');
        $listing = $this->app->make(AgentListing::class);

        DB::enableQueryLog();
        $first = $listing->firstPageWith([]);
        $firstReads = count(DB::getQueryLog());
        $this->assertNotNull($first->next, 'The first page names no next page.');
        DB::flushQueryLog();
        $second = $listing->pageAfter($first->next);
        $secondReads = count(DB::getQueryLog());
        DB::disableQueryLog();

        $firstIds = $this->idsOf($first->agents);
        $secondIds = $this->idsOf($second->agents);
        $withChosen = $this->idsOf($listing->firstPageWith([$secondIds[0]])->agents);

        $this->assertSame(
            [
                array_map(
                    fn (string $name) => $this->journal->actorCalled($name)->id,
                    ['Agent 17', 'Agent 09', 'Agent 05'],
                ),
                AgentListing::PAGE_SIZE,
                [],
                Agent::query()->count(),
                null,
                $firstReads,
                [AgentListing::PAGE_SIZE + 1, $secondIds[0]],
            ],
            [
                array_slice($firstIds, 0, 3),
                count($firstIds),
                array_values(array_intersect($firstIds, $secondIds)),
                count($firstIds) + count($secondIds),
                $second->next,
                $secondReads,
                [count($withChosen), $withChosen[array_key_last($withChosen)]],
            ],
        );
    }

    /**
     * @param  list<AgentOptionData>  $agents
     * @return list<string>
     */
    private function idsOf(array $agents): array
    {
        return array_map(fn (AgentOptionData $agent) => $agent->id, $agents);
    }

    private function listed(string $name): AgentOptionData
    {
        $id = $this->journal->actorCalled($name)->id;

        foreach ($this->app->make(AgentListing::class)->firstPageWith([])->agents as $agent) {
            if ($agent->id === $id) {
                return $agent;
            }
        }

        $this->fail("{$name} is not listed.");
    }
}
