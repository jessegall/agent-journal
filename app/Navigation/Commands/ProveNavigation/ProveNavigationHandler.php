<?php

declare(strict_types=1);

namespace App\Navigation\Commands\ProveNavigation;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\NavigationRaiseRefused;
use App\Navigation\Enums\NavigationCompletion;
use App\Navigation\Exceptions\NavigationAnswerRefused;
use App\Navigation\Exceptions\NavigationProofRefused;
use App\Navigation\NavigationAnswerCheck;
use App\Navigation\NavigationRounds;
use App\Navigation\Values\NavigationProof;
use App\Values\DriverReceipt;
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
        $navigation = $this->answering->lockedForHandler($command->navigationId);

        if (! $navigation->isAnswering()) {
            throw NavigationAnswerRefused::notAnswerable($navigation->id, $navigation->status->value);
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

        return $request->receipt;
    }
}
