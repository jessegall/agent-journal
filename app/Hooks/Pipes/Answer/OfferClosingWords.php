<?php

declare(strict_types=1);

namespace App\Hooks\Pipes\Answer;

use App\Bus\Contracts\Pipe;
use App\Hooks\CallStages\RestoredCall;
use App\Hooks\CallStages\WalkedCall;
use App\Models\Drivers\DriverTurn;
use App\Stacks\HookAnswer;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Values\AgentText;

/**
 * A stop with closing words not yet offered on its turn keeps them privately and is refused once with the question
 * whether the user should see them.
 */
final readonly class OfferClosingWords implements Pipe
{
    /**
     * Whether the call is a stop whose closing words its turn has not offered yet.
     */
    public static function isNeeded(RestoredCall $restored): bool
    {
        $input = $restored->call->input;

        if (! $input instanceof StopRequested || ! $input->stop->hasClosingWords()) {
            return false;
        }

        $turn = DriverTurn::findForSessionTurn($input->hook->sessionId, $input->stop->turnId);

        return $turn !== null && ! $turn->hasOffered($input->stop->closingWords);
    }

    public function handle(RestoredCall $restored): WalkedCall
    {
        $input = $restored->call->input;
        assert($input instanceof StopRequested);

        $turn = DriverTurn::findForSessionTurn($input->hook->sessionId, $input->stop->turnId);

        if ($turn !== null) {
            $turn->offerClosingWords($input->stop->closingWords);
        }

        return $restored->walked(new HookAnswer(
            Decision::deny(AgentText::of('core.messages.closing_words_offer')),
            [],
            [],
            $restored->stackBefore,
        ));
    }
}
