<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\JournalAdmission;
use App\Contracts\Inboxes\MainInbox;
use App\Exceptions\NavigationAnswerRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Models\Drivers\NavigationRequest;

/**
 * What every command of the main agent on a navigation request checks first: the request, locked; that the caller
 * answers it, as main's occupant or the owner; and that it read the newest row version.
 */
final readonly class NavigationAnswerCheck
{
    public function __construct(
        private CurrentActor $actors,
        private JournalAdmission $admission,
        private MainInbox $main,
    ) {}

    /**
     * The request, locked for the caller who answers it.
     *
     * @throws NavigationRaiseRefused
     * @throws NavigationAnswerRefused
     */
    public function lockedForAnswerer(string $navigationId): NavigationRequest
    {
        $navigation = NavigationRequest::query()
            ->acrossActors()
            ->whereKey($navigationId)
            ->lockForUpdate()
            ->firstOr(NavigationRaiseRefused::throwing()->unknownRequest($navigationId));

        $this->checkAnswerer($navigation);

        return $navigation;
    }

    /**
     * Refuses a caller who neither sits at main nor owns the journal.
     *
     * @throws NavigationAnswerRefused
     */
    public function checkAnswerer(NavigationRequest $navigation): void
    {
        $actor = ActorIdentity::of($this->actors->actor());
        $owner = ActorIdentity::of($this->admission->owner());
        $seated = $this->main->occupant()->map(fn (ActorIdentity $occupant) => $occupant->isSameAs($actor));

        if (! $actor->isSameAs($owner) && ! $seated->getOrElse(false)) {
            throw NavigationAnswerRefused::ofAnotherActor($navigation->id);
        }
    }

    /**
     * @throws NavigationAnswerRefused
     */
    public function assertCurrentVersion(NavigationRequest $navigation, int $expectedRowVersion): void
    {
        if (! $navigation->isAtRowVersion($expectedRowVersion)) {
            throw NavigationAnswerRefused::staleVersion(
                $navigation->id,
                $expectedRowVersion,
                $navigation->row_version,
                $navigation->screen->generation,
            );
        }
    }
}
