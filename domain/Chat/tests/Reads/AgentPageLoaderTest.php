<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use Domain\Chat\Data\AgentOptionData;
use Domain\Chat\Data\AgentPageCursorData;
use Domain\Chat\Http\Loaders\AgentPageLoader;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;

/**
 * The chat list's next page holds the agents after the one its cursor names, those never active by id downward, and
 * names no page after the last.
 */
#[TestsRead(AgentPageLoader::class)]
final class AgentPageLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_page_after_an_agent_never_active_holds_the_ones_below_it(): void
    {
        $this->journal->owner()->idleAgent('Planner')->idleAgent('Reviewer');
        $ids = [$this->journal->agentCalled('Planner')->id, $this->journal->agentCalled('Reviewer')->id];
        rsort($ids);
        $this->journal->actAs('Owner');

        $page = $this->app->make(AgentPageLoader::class)(AgentPageCursorData::validateAndCreate([
            'afterAgentId' => $ids[0],
        ]));

        $listed = array_map(fn (AgentOptionData $agent) => $agent->id, $page->agents);

        $this->assertSame(
            [true, false, null],
            [in_array($ids[1], $listed, true), in_array($ids[0], $listed, true), $page->next],
        );
    }
}
