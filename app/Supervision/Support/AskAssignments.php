<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\JournalAssignableProvider;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\JournalAssignment;
use App\Bus\Support\CommandNesting;
use App\Records\Support\RecordIdentity;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Values\AskReference;

final readonly class AskAssignments implements JournalAssignableProvider
{
    public function __construct(
        private AskRecords $asks,
        private CurrentActor $actors,
        private CommandNesting $nesting,
        private SupervisorGraphLock $graph,
        private SupervisorRouting $routes,
        private SupervisorRecipients $recipients,
        private SupervisorOwner $owner,
    ) {}

    public function requireJournalAssignment(JournalAssignment $assignment): void
    {
        if (! $this->nesting->runs(RouteAsk::class)) {
            throw AskRefused::routeChanged();
        }

        $this->graph->acquire();
        $ask = $this->asks->lock(new AskReference($assignment->record->id));
        $this->requireRouteEditor($ask);
        $pending = $ask->requirePending($assignment->expectedVersion);
        $route = $this->routes->routeFor($ask->requester(), $ask->typeKey());
        $recipient = $this->recipients->resolve($route->target);

        $isRecipient = $recipient
            ->map(fn (ActorIdentity $actor) => AssigneeIdentity::ofActorIdentity($actor))
            ->map(fn (AssigneeIdentity $assignee) => $assignee->isSameAs($assignment->recipient))
            ->getOrElse(false);
        $stillRouted = $route->target->key === $pending->key && $isRecipient;

        if (! $stillRouted) {
            throw AskRefused::routeChanged();
        }
    }

    public function requireAssignable(RecordIdentity $record): Assignable
    {
        return $this->asks->read(new AskReference($record->id));
    }

    public function visibleRecords(array $records): array
    {
        if ($records === []) {
            return [];
        }

        $ids = array_map(fn (RecordIdentity $record) => $record->id, $records);
        $found = $this->asks->visible()->whereKey($ids)->readLimit(count($ids))->pluck('id')->all();

        return array_values(array_filter($records, fn (RecordIdentity $record) => in_array($record->id, $found, true)));
    }

    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Assignable $record) => $record->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Ask && ! $record->open),
        ));
    }

    private function requireRouteEditor(Ask $ask): void
    {
        $actor = ActorIdentity::of($this->actors->actor());

        if (! $ask->requester()->isSameAs($actor) && ! $this->owner->resolve()->endsAt($actor)) {
            throw AskRefused::routeChanged();
        }
    }
}
