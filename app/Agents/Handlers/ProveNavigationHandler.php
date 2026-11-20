<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ProveNavigation;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\NavigationProofRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\NavigationAnswerCheck;
use App\Agents\Support\NavigationRounds;
use App\Agents\Values\NavigationProof;
use App\Agents\Values\NavigationRound;
use App\Contracts\CommandHandler;

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
    public function handle(ProveNavigation $command): DriverReceipt
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
