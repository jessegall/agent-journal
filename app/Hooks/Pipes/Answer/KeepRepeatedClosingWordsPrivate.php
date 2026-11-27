<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\RestoredCall;
use App\Models\Drivers\DriverTurn;

/**
 * A stop with the same closing words as the offer pending on its turn keeps them private; the stack then answers the
 * stop as usual.
 */
final readonly class KeepRepeatedClosingWordsPrivate implements Pipe
{
    public function handle(RestoredCall $restored): RestoredCall
    {
        $input = $restored->call->stopWithClosingWords();

        if ($input === null) {
            return $restored;
        }

        $turn = DriverTurn::findForSessionTurn($input->hook->sessionId, $input->stop->turnId);

        if ($turn?->hasOffered($input->stop->closingWords) === true && $turn->isOfferPending()) {
            $turn->keepClosingWordsPrivate();
        }

        return $restored;
    }
}
