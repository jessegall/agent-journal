<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\AnswerNavigation;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\NavigationAnswering;
use App\Agents\Support\NavigationRounds;
use App\Agents\Values\NavigationRound;
use App\Contracts\CommandHandler;

/**
 * Sends the main agent's round to the stalled runtime as a Navigate driver request, once per row version: only the
 * main desk's occupant or the owner answers, only an open request, only at the newest row version and screen.
 */
final readonly class AnswerNavigationHandler implements CommandHandler
{
    public function __construct(
        private NavigationRounds $rounds,
        private NavigationAnswering $answering,
    ) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(AnswerNavigation $command): DriverReceipt
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);

        $sent = DriverRequest::query()
            ->where('navigation_request_id', $navigation->id)
            ->where('idempotency_key', NavigationRounds::keyOf($navigation, $command->expectedRowVersion))
            ->first();
        if ($sent !== null) {
            return $sent->receipt();
        }
        $this->checkAnswerable($navigation, $command);

        $round = NavigationRound::answering(
            $navigation->id,
            $command->expectedRowVersion,
            $command->generation,
            $command->answer,
        );
        $request = $this->rounds->append($navigation, $round);
        $navigation->answer();

        return $request->receipt();
    }

    /**
     * @throws NavigationAnswerRefused
     */
    private function checkAnswerable(NavigationRequest $navigation, AnswerNavigation $command): void
    {
        if (! in_array($navigation->state, [NavigationState::Open, NavigationState::Answering], true)) {
            throw NavigationAnswerRefused::notAnswerable($navigation->id, $navigation->state->value);
        }
        $this->answering->checkVersion($navigation, $command->expectedRowVersion);
        if ($navigation->screen->generation !== $command->generation) {
            throw NavigationAnswerRefused::staleScreen(
                $navigation->id,
                $command->generation,
                $navigation->screen->generation,
            );
        }
        $parameter = $command->answer->typeParameter;
        if ($parameter !== null && ! array_key_exists($parameter, $navigation->goal_parameters)) {
            throw NavigationAnswerRefused::freeText($parameter);
        }
    }
}
