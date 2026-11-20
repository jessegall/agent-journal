<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Assignments\Models\AssignmentRecord;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Enums\UnansweredReason;
use App\Supervision\Exceptions\SupervisorRouteRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use Carbon\CarbonImmutable;

/**
 * Moves a due ask one hop up its holder's supervisor chain in one transaction: the old assignment is released, its
 * hop closes and the same ask is assigned to the next supervisor of the same type. An ask past its lifetime, one at
 * the root of the chain, one with no higher owner and one that would return to an actor it already passed close
 * unanswered and stay visible.
 */
final readonly class AskEscalation
{
    public function __construct(
        private SupervisorRouting $routes,
        private SupervisorRecipients $recipients,
        private AskRouter $router,
        private JournalAssignmentWriter $assignments,
    ) {}

    public function advance(Ask $ask, AskHop $hop, CarbonImmutable $now): void
    {
        if ($ask->hasOutlived($now)) {
            $this->closeUnanswered($ask, UnansweredReason::TotalExpiry);

            return;
        }

        if (! $hop->isHeldByAgent()) {
            $this->closeUnanswered($ask, UnansweredReason::RootTimeout);

            return;
        }

        $next = $this->nextTarget($ask, $hop);
        $recipient = $this->recipients->resolve($next);

        if ($recipient->isEmpty()) {
            $this->closeUnanswered($ask, UnansweredReason::NoOwner);

            return;
        }

        if (AskHop::hasHeld($ask, $recipient->get())) {
            $this->closeUnanswered($ask, UnansweredReason::Cycle);

            return;
        }

        $held = AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->firstOrFail()->toAssignment();
        $this->router->reroute($ask, $next, $held->reference);
    }

    /**
     * The supervisor the holder's profile names for the ask's type; a holder that retired or left has none of its
     * own, so the ask goes to the owner.
     */
    private function nextTarget(Ask $ask, AskHop $hop): SupervisorTarget
    {
        try {
            return $this->routes->routeFor($hop->holder(), $ask->typeKey())->target;
        } catch (SupervisorRouteRefused) {
            return new SupervisorTarget();
        }
    }

    private function closeUnanswered(Ask $ask, UnansweredReason $reason): void
    {
        $this->assignments->releaseForJournal($ask->assignmentIdentity());
        $ask->closeUnanswered($reason);
    }
}
