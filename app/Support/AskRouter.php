<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Contracts\Processes\SupervisorDispatch;
use App\Enums\AskRouteStatus;
use App\Enums\SupervisorDispatchOutcome;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Values\SupervisorRequest;
use App\Values\SupervisorTarget;

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
        private SupervisorDispatch $dispatch,
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

        if ($found->isEmpty() && $target->isProfile()) {
            $request = new SupervisorRequest($target->profileKey()->key, $ask->id, $ask->body, $ask->actor());

            if ($this->dispatch->startFor($request) === SupervisorDispatchOutcome::Unavailable) {
                return AskRouteStatus::Unavailable;
            }

            $found = $this->recipients->resolve($target);
        }

        if ($found->isEmpty()) {
            if ($target->isOwner()) {
                return AskRouteStatus::NoOwner;
            }

            return AskRouteStatus::PendingProfile;
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

        $route = $this->routes->routeOf($ask);
        $ask->accept();
        $this->attention->retainHop(AskHop::create($ask, $recipient, $route->version));

        return AskRouteStatus::Assigned;
    }
}
