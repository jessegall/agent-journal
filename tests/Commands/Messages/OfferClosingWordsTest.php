<?php

declare(strict_types=1);

namespace Tests\Commands\Messages;

use App\Messages\Commands\OfferClosingWords\OfferClosingWordsCommand;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use Carbon\CarbonImmutable;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The closing words of a turn are offered and held on the turn until the agent sends or keeps them.
 */
#[TestsCommand(OfferClosingWordsCommand::class)]
final class OfferClosingWordsTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['driver_turns'];

    public function test_the_words_are_held_on_their_turn(): void
    {
        $this->journal->owner()->agent('Planner');
        $session = $this->journal->sessionOf('Planner');
        $runtime = AgentRuntime::findForSession($session->id);
        $turn = DriverTurn::create($runtime->id, $runtime->process_generation, 'prompt-1', CarbonImmutable::now());

        $this->journal->asOwner(new OfferClosingWordsCommand($session->agent_id, $session->id, 'prompt-1', 'Half way.'));

        $turn->refresh();
        $this->journal->assertResult([true, true], [$turn->hasOffered('Half way.'), $turn->isOfferPending()]);
    }
}
