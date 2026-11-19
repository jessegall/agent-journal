<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\AnswerNavigation;
use App\Agents\Contracts\MainDesk;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\NavigationAnswerRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\DriverReceipt;
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
        private CurrentActor $actors,
        private JournalAdmission $admission,
        private MainDesk $mainDesk,
    ) {}

    /**
     * @throws NavigationAnswerRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(AnswerNavigation $command): DriverReceipt
    {
        $navigation = NavigationRequest::query()
            ->acrossActors()
            ->whereKey($command->navigationId)
            ->lockForUpdate()
            ->first()
            ?? throw NavigationRaiseRefused::unknownRequest($command->navigationId);
        $this->checkAnswerer($navigation);

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
    private function checkAnswerer(NavigationRequest $navigation): void
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $owner = ActorIdentity::of($this->admission->owner());
        $seated = $this->mainDesk->occupant()->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($actor));
        if (! $actor->isSameAs($owner) && ! $seated->getOrElse(false)) {
            throw NavigationAnswerRefused::notYours($navigation->id);
        }
    }

    /**
     * @throws NavigationAnswerRefused
     */
    private function checkAnswerable(NavigationRequest $navigation, AnswerNavigation $command): void
    {
        if (! in_array($navigation->state, [NavigationState::Open, NavigationState::Answering], true)) {
            throw NavigationAnswerRefused::notAnswerable($navigation->id, $navigation->state->value);
        }
        if (! $navigation->isAtRowVersion($command->expectedRowVersion)) {
            throw NavigationAnswerRefused::staleVersion(
                $navigation->id,
                $command->expectedRowVersion,
                $navigation->row_version,
                $navigation->screen->generation,
            );
        }
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
