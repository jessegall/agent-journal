<?php

declare(strict_types=1);

namespace App\Pipes\Answer;

use App\Contracts\Bus\Pipe;
use App\Models\Drivers\DriverTurn;
use App\Support\CallStages\RestoredCall;
use App\Support\Inputs\StopRequested;

/**
 * A stop with the same closing words as the offer pending on its turn keeps them private; the stack then answers the
 * stop as usual.
 */
final readonly class KeepRepeatedClosingWordsPrivate implements Pipe
{
    public function handle(RestoredCall $restored): RestoredCall
    {
        $input = $restored->call->input;

        if (! $input instanceof StopRequested || ! $input->stop->hasClosingWords()) {
            return $restored;
        }

        $turn = DriverTurn::findForSessionTurn($input->hook->sessionId, $input->stop->turnId);

        if ($turn?->hasOffered($input->stop->closingWords) === true && $turn->isOfferPending()) {
            $turn->keepClosingWordsPrivate();
        }

        return $restored;
    }
}
