<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Models\Agents\AgentRunningTool;
use App\Models\Inboxes\Inbox;
use App\Sessions\Contracts\AgentDirectory;
use App\Support\AgentOption;
use App\Values\ToolLine;
use App\Web\Data\RunningCommandData;
use Domain\Chat\Resolvers\Support\ChatPages;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;

/**
 * The chat page seeds its line above the composer with the agent's running tool call as its row holds it, the same
 * shape the pushed changes carry, and with none before the agent's first call.
 */
final class RunningCommandSeedTest extends TestCase
{
    public function test_the_page_seeds_the_line_with_the_agents_running_tool_call(): void
    {
        $chat = $this->chatWithPlanner();
        $plannerId = $this->journal->actorCalled('Planner')->id;
        $this->assertNull($this->runningCommand($chat));

        AgentRunningTool::startFor($plannerId, ToolLine::shell('npm test'));
        $seed = $this->runningCommand($chat);
        $this->assertSame([$plannerId, 'Bash npm test', true], [$seed?->agentId, $seed?->line, $seed?->isRunning]);

        AgentRunningTool::finishFor($plannerId);
        $finished = $this->runningCommand($chat);
        $this->assertSame(['Bash npm test', false], [$finished?->line, $finished?->isRunning]);

        AgentRunningTool::clearFor($plannerId);
        $cleared = $this->runningCommand($chat);
        $this->assertSame([null, false], [$cleared?->line, $cleared?->isRunning]);
    }

    public function test_the_seed_carries_the_time_of_the_rows_last_change(): void
    {
        $chat = $this->chatWithPlanner();
        $plannerId = $this->journal->actorCalled('Planner')->id;
        AgentRunningTool::startFor($plannerId, ToolLine::shell('npm test'));

        $this->assertSame(
            AgentRunningTool::shownOf($plannerId)->get()->changedAtText(),
            $this->runningCommand($chat)?->changedAt,
        );
    }

    private function chatWithPlanner(): Inbox
    {
        $this->journal->owner()->agent('Planner');

        return $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');
    }

    private function runningCommand(Inbox $chat): RunningCommandData|null
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
