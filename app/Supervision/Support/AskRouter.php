<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\JournalAssignment;
use App\Profiles\Values\SupervisorTarget;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Models\Ask;

/**
 * Assigns an ask to the actor its pending target names and records the hop, for a first route and an escalation
 * alike.
 */
final readonly class AskRouter
{
    public function __construct(
        private SupervisorRecipients $recipients,
        private SupervisorRouting $routes,
        private JournalAssignmentWriter $writer,
        private AskAttention $attention,
    ) {}

    /**
     * Moves the ask from the assignment it holds to the target an escalation named for it.
     */
    public function reroute(Ask $ask, SupervisorTarget $next, AssignmentReference $held): AskRouteStatus
    {
        $ask->escalateTo($next);

        return $this->assign($ask, $next, $held);
    }

    public function route(Ask $ask, int $expectedVersion, AssignmentReference|null $current): AskRouteStatus
    {
        return $this->assign($ask, $ask->requirePending($expectedVersion), $current);
    }

    /**
     * Assigns the ask at its current version to the actor the target names and records the hop.
     */
    private function assign(Ask $ask, SupervisorTarget $target, AssignmentReference|null $current): AskRouteStatus
    {
        $found = $this->recipients->resolve($target);

        if ($found->isEmpty()) {
            return $target->isOwner() ? AskRouteStatus::NoOwner : AskRouteStatus::PendingProfile;
        }

        $recipient = $found->get();
        $assignment = new JournalAssignment(
            $ask->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($recipient),
            $ask->version,
        );

        if ($current === null) {
            $this->writer->assignForJournal($assignment);
        } else {
            $this->writer->reassignForJournal($assignment, $current);
        }

        $route = $this->routes->routeFor($ask->requester(), $ask->typeKey());
        $this->attention->retainHop($ask->accept($recipient, $route->version));

        return AskRouteStatus::Assigned;
    }
}
