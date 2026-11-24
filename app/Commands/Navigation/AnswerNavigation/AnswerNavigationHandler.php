<?php

declare(strict_types=1);

namespace App\Commands\Navigation\AnswerNavigation;

use App\Contracts\Bus\CommandHandler;
use App\Enums\NavigationState;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Support\NavigationAnswerCheck;
use App\Support\NavigationRounds;
use App\Values\DriverReceipt;
use App\Values\NavigationRound;
use App\Values\ScriptProgress;

/**
 * Sends the main agent's round to the stalled runtime as a Navigate driver request, once per row version: only the
 * main desk's occupant or the owner answers, only an open request, only at the newest row version and screen.
 */
final readonly class AnswerNavigationHandler implements CommandHandler
{
    public function __construct(
        private NavigationRounds $rounds,
        private NavigationAnswerCheck $answering,
    ) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(AnswerNavigationCommand $command): DriverReceipt
    {
        $navigation = $this->answering->lockedForAnswerer($command->navigationId);

        $sent = DriverRequest::query()
            ->where('navigation_request_id', $navigation->id)
            ->where('idempotency_key', NavigationRounds::keyOf($navigation, $command->expectedRowVersion))
            ->first();

        if ($sent !== null) {
            return $sent->receipt;
        }

        $this->checkAnswerable($navigation, $command);

        $round = NavigationRound::answering(
            $navigation->id,
            $command->expectedRowVersion,
            $command->generation,
            $command->answer,
        );

        $request = $this->rounds->append($navigation, $round);

        if ($navigation->state === NavigationState::Open) {
            $this->recordAnswered($navigation);
        }

        $navigation->answer();

        return $request->receipt;
    }

    /**
     * Tells the user, on the stalled key script's request, that the main agent took the request up.
     */
    private function recordAnswered(NavigationRequest $navigation): void
    {
        $stalled = DriverRequest::lockedById($navigation->driver_request_id);
        $generation = $navigation->screen->generation;

        $stalled->recordScriptProgress(
            new ScriptProgress($navigation->stalled_step, $generation, 'answered by main agent'),
        );
    }

    /**
     * @throws NavigationAnswerRefused
     */
    private function checkAnswerable(NavigationRequest $navigation, AnswerNavigationCommand $command): void
    {
        if (! in_array($navigation->state, [NavigationState::Open, NavigationState::Answering], true)) {
            throw NavigationAnswerRefused::notAnswerable($navigation->id, $navigation->state->value);
        }

        $this->answering->assertCurrentVersion($navigation, $command->expectedRowVersion);

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
