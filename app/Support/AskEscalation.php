<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Enums\Asks\UnansweredReason;
use App\Exceptions\SupervisorRouteRefused;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Records\AssignmentRecord;
use App\Values\SupervisorTarget;
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
        private SupervisorDefinitions $routes,
        private SupervisorRecipients $recipients,
        private AskRouter $router,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
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

        $held = AssignmentRecord::query()->forRecord($ask->assignmentIdentity())->firstOrFail()->toAssignment;
        $this->router->reroute($ask, $next, $held->reference);
        $this->attention->offerNext($hop->actor());
    }

    /**
     * The supervisor the holder's profile names for the ask's type; a holder that retired or left has none of its
     * own, so the ask goes to the owner.
     */
    private function nextTarget(Ask $ask, AskHop $hop): SupervisorTarget
    {
        try {
            return $this->routes->routeFor($hop->actor(), $ask->type_key)->target;
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
