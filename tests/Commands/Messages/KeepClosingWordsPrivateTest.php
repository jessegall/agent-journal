<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Messages\Commands\KeepClosingWordsPrivate\KeepClosingWordsPrivateCommand;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Closing words the agent repeated instead of sending them stay private: the offer is no longer pending.
 */
#[TestsCommand(KeepClosingWordsPrivateCommand::class)]
final class KeepClosingWordsPrivateTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['driver_turns'];

    public function test_the_offered_words_are_no_longer_pending(): void
    {
        $this->journal->owner()->agent('Planner');
        $session = $this->journal->sessionOf('Planner');
        $runtime = AgentRuntime::findForSession($session->id);
        $turn = DriverTurn::create($runtime->id, $runtime->process_generation, 'prompt-1', CarbonImmutable::now());
        $turn->offerClosingWords('Half way.');

        $this->journal->asOwner(new KeepClosingWordsPrivateCommand($session->agent_id, $session->id, 'prompt-1'));

        $turn->refresh();
        $this->journal->assertResult([true, false], [$turn->hasOffered('Half way.'), $turn->isOfferPending()]);
    }
}
