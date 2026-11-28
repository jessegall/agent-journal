<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\ChooseNextStart\ChooseNextStartCommand;
use App\Models\Agents\AgentStartChoice;
use App\Values\ChosenAccount;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner's choice for an agent's next start is kept for it, the first one made and each later one in its place.
 */
#[TestsCommand(ChooseNextStartCommand::class)]
final class ChooseNextStartTest extends TestCase
{
    use RefreshHookDatabase;

    private const string FIRST_ACCOUNT = '01m8gv00000000000000000001';

    private const string LATER_ACCOUNT = '01m8gv00000000000000000002';

    public function test_the_first_choice_is_kept_and_a_later_one_takes_its_place(): void
    {
        $agentId = $this->journal->owner()->idleAgent('Main', 'main-agent')->agentCalled('Main')->id;

        $this->journal->asOwner(new ChooseNextStartCommand($agentId, 'claude-code-headless', 'opus', new ChosenAccount(self::FIRST_ACCOUNT, 1)));
        $first = AgentStartChoice::findFor($agentId);
        $this->journal->asOwner(new ChooseNextStartCommand($agentId, 'codex-headless', 'gpt-6-luna', new ChosenAccount(self::LATER_ACCOUNT, 2)));
        $later = AgentStartChoice::findFor($agentId);

        $this->journal->assertResult(
            [['claude-code-headless', 'opus', self::FIRST_ACCOUNT], ['codex-headless', 'gpt-6-luna', self::LATER_ACCOUNT], 1],
            [
                [$first?->driver, $first?->model, $first?->account_id],
                [$later?->driver, $later?->model, $later?->account_id],
                AgentStartChoice::query()->count(),
            ],
        );
    }
}
