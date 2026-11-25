<?php

declare(strict_types=1);

namespace App\Commands\Navigation\ProveNavigation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\NavigationCompletion;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationProofRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Support\NavigationAnswerCheck;
use App\Support\NavigationRounds;
use App\Values\DriverReceipt;
use App\Values\NavigationProof;
use App\Values\NavigationRound;

/**
 * Moves an answered request to proving with its proof and what it completes, and sends the host a round that checks
 * the proof on the live screen; a proof the raise-time screen already showed proves nothing and is refused.
 */
final readonly class ProveNavigationHandler implements CommandHandler
{
    public function __construct(
        private NavigationAnswerCheck $answering,
        private NavigationRounds $rounds,
    ) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationProofRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(ProveNavigationCommand $command): DriverReceipt
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);

        if (! $navigation->isAnswering()) {
            throw NavigationAnswerRefused::notAnswerable($navigation->id, $navigation->state->value);
        }

        $this->answering->assertCurrentVersion($navigation, $command->expectedRowVersion);
        $proof = NavigationProof::against($command->proof, $navigation->raise_rows);
        $nextStep = $command->completes === NavigationCompletion::Step ? $navigation->stalled_step + 1 : null;

        $round = NavigationRound::proof(
            $navigation->id,
            $command->expectedRowVersion,
            $navigation->screen->generation,
            $proof->text,
            $command->completes,
            $nextStep,
        );

        $request = $this->rounds->append($navigation, $round);
        $navigation->prove($command->completes, $nextStep, $proof->text);

        return $request->receipt();
    }
}
