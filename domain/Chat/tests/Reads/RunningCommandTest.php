<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Agents\Activity\Contracts\ActivityLog;
use App\Agents\Enums\ActivityType;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Inboxes\Inbox;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\AgentOption;
use Carbon\CarbonImmutable;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;

/**
 * The chat page names what its agent read, ran or edited last, from the user's send until the agent's own message
 * arrives, and nothing before or after.
 */
final class RunningCommandTest extends TestCase
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

    public function test_the_page_names_the_latest_tool_work_of_the_agent_until_its_message_arrives(): void
    {
        $this->journal->owner()->agent('Planner');
        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');
        $planner = $this->journal->actorCalled('Planner');

        CarbonImmutable::setTestNow('2026-11-30 09:00:00');
        $this->journal->runAs('Owner', new SendMessageCommand($chat->id, 'Run the checks.'));
        $this->assertNull($this->runningCommand($chat));

        CarbonImmutable::setTestNow('2026-11-30 09:00:05');
        $this->app->make(ActivityLog::class)->record($planner, ActivityType::Read, 'src/a.php');
        CarbonImmutable::setTestNow('2026-11-30 09:00:08');
        $this->app->make(ActivityLog::class)->record($planner, ActivityType::Ran, 'npm test');
        $this->assertSame('Ran npm test', $this->runningCommand($chat));

        CarbonImmutable::setTestNow('2026-11-30 09:00:12');
        $this->journal->runAs('Planner', new SendMessageCommand($chat->id, 'All green.'));
        $this->journal->actAs('Owner');
        $this->assertNull($this->runningCommand($chat));

        CarbonImmutable::setTestNow('2026-11-30 09:00:20');
        $this->app->make(ActivityLog::class)->record($planner, ActivityType::Edited, 'src/b.php');
        $this->assertSame('Edited src/b.php', $this->runningCommand($chat));
    }

    private function runningCommand(Inbox $chat): string|null
    {
        $plannerId = $this->journal->actorCalled('Planner')->id;
        $agents = array_filter(
            $this->app->make(AgentDirectory::class)->visible(),
            fn (AgentOption $option) => $option->agentId === $plannerId,
        );
        $agent = reset($agents);

        return $this->app->make(ChatPages::class)->pageFor($agent, $chat, null)->runningCommand;
    }
}
