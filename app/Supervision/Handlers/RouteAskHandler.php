<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\JournalAssignment;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Enums\AskRouteStatus;
use App\Supervision\Support\AskRecords;
use App\Supervision\Support\SupervisorRecipients;
use App\Supervision\Support\SupervisorRouting;

final readonly class RouteAskHandler implements CommandHandler
{
    public function __construct(
        private AskRecords $asks,
        private SupervisorRecipients $recipients,
        private SupervisorRouting $routes,
        private JournalAssignmentWriter $writer,
    ) {}

    public function handle(RouteAsk $command): AskRouteStatus
    {
        $ask = $this->asks->read($command->ask);
        $target = $ask->requirePending($command->expectedVersion);
        $recipient = $this->recipients->resolve($target);

        if ($recipient === null) {
            return $target->isOwner() ? AskRouteStatus::NoOwner : AskRouteStatus::PendingProfile;
        }

        $assignment = new JournalAssignment(
            $ask->assignmentIdentity(),
            AssigneeIdentity::ofActorIdentity($recipient),
            $command->expectedVersion,
        );

        if ($command->current === null) {
            $this->writer->assignForJournal($assignment);
        } else {
            $this->writer->reassignForJournal($assignment, $command->current);
        }

        $route = $this->routes->routeFor($ask->requester(), $ask->typeKey());
        $ask->accept($recipient, $route->version);

        return AskRouteStatus::Assigned;
    }
}
