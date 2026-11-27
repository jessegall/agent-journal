<?php

declare(strict_types=1);

namespace App\Sessions\States;

use App\Messages\Commands\KeepClosingWordsPrivate\KeepClosingWordsPrivateCommand;
use App\Messages\Commands\OfferClosingWords\OfferClosingWordsCommand;
use App\Models\Drivers\DriverTurn;
use App\Sessions\States\Support\ClosingWordsStateReference;
use App\Stacks\AgentState;
use App\Stacks\Attributes\StateType;
use App\Stacks\Contracts\Work\BaseState;
use App\Support\Command;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Values\AgentText;
use Generator;

/**
 * The agent's closing words, for the session's whole life: a stop that ends a turn with words the turn has not offered
 * yet is refused once with the offer to send them, and a stop that repeats the words it was offered keeps them private.
 */
#[StateType(ClosingWordsStateReference::class, schemaVersion: 1)]
final class ClosingWordsState extends AgentState implements BaseState
{
    public function __construct(private readonly string $agentId, private readonly string $sessionId) {}

    // ----------[ Hooks ]----------

    /**
     * @return Generator<int, Decision|Command<mixed>>
     */
    public function onStop(StopRequested $input): Generator
    {
        $stop = $input->stop;

        if (! $stop->hasClosingWords()) {
            return;
        }

        $turn = DriverTurn::findForSessionTurn($this->sessionId, $stop->turnId);

        if ($turn === null) {
            return;
        }

        if (! $turn->hasOffered($stop->closingWords)) {
            yield new OfferClosingWordsCommand($this->agentId, $this->sessionId, $stop->turnId, $stop->closingWords);

            yield Decision::deny(AgentText::of('core.messages.closing_words_offer'));

            return;
        }

        if ($turn->isOfferPending()) {
            yield new KeepClosingWordsPrivateCommand($this->agentId, $this->sessionId, $stop->turnId);
        }
    }
}
