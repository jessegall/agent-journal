<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Actors\Contracts\CurrentActor;
use App\Asks\AskRecords;
use App\Asks\Commands\AdvanceAsk\AdvanceAskCommand;
use App\Asks\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Asks\Commands\RouteAsk\RouteAskCommand;
use App\Asks\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Asks\Exceptions\AskRefused;
use App\Asks\SupervisorDefinitions;
use App\Asks\SupervisorGraphLock;
use App\Asks\SupervisorOwner;
use App\Asks\SupervisorRecipients;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\JournalAssignableProvider as JournalAssignableProviderContract;
use App\Bus\CommandNesting;
use App\Models\Asks\Ask;
use App\Support\ActorReference;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;
use App\Values\AskReference;

final readonly class JournalAssignableProvider implements JournalAssignableProviderContract
{
    /**
     * The commands that route an ask to its first holder.
     */
    private const array ROUTING_COMMANDS = [
        RouteAskCommand::class,
    ];

    /**
     * The commands that end an ask for its holder: an answer or a withdrawal.
     */
    private const array ANSWERING_COMMANDS = [
        ReplyToAskCommand::class,
        WithdrawAskCommand::class,
    ];

    public function __construct(
        private AskRecords $asks,
        private CurrentActor $actors,
        private CommandNesting $nesting,
        private SupervisorGraphLock $graph,
        private SupervisorDefinitions $routes,
        private SupervisorRecipients $recipients,
        private SupervisorOwner $owner,
    ) {}

    public function requireJournalAssignment(JournalAssignment $assignment): void
    {
        if ($this->nesting->runs(AdvanceAskCommand::class)) {
            $this->requireEscalationRecipient($assignment);

            return;
        }

        if (! $this->runsAny(self::ROUTING_COMMANDS)) {
            throw AskRefused::routeChanged();
        }

        $this->graph->acquire();
        $ask = $this->asks->lock(new AskReference($assignment->record->id));
        $this->requireRouteEditor($ask);

        $pending = $ask->requirePending($assignment->expectedVersion);
        $route = $this->routes->routeOf($ask);
        $recipient = $this->recipients->resolve($route->target);

        $isRecipient = $recipient
            ->map(fn (ActorReference $actor) => AssigneeIdentity::ofActorReference($actor))
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

    public function assertJournalRelease(RecordIdentity $record): void
    {
        $escalates = $this->nesting->runs(AdvanceAskCommand::class);

        if (! $escalates && ! $this->runsAny(self::ANSWERING_COMMANDS)) {
            throw AskRefused::routeChanged();
        }

        $ask = $escalates
            ? Ask::findLockedForMaintenance($record->id)
            : $this->asks->read(new AskReference($record->id));

        if (! $ask->open) {
            throw AskRefused::routeChanged();
        }
    }

    public function visibleRecords(array $records): array
    {
        if ($records === []) {
            return [];
        }

        $ids = array_map(fn (RecordIdentity $record) => $record->id, $records);
        $found = $this->asks->visible()->whereKey($ids)->pluck('id')->all();

        return RecordIdentity::among($records, $found);
    }

    public function finishedRecords(array $records): array
    {
        return array_values(array_map(
            fn (Assignable $record) => $record->assignmentIdentity(),
            array_filter($records, fn (Assignable $record) => $record instanceof Ask && ! $record->open),
        ));
    }

    /**
     * An escalation assigns the ask to the actor its pending target names, and to nobody else.
     */
    private function requireEscalationRecipient(JournalAssignment $assignment): void
    {
        $ask = Ask::findLockedForMaintenance($assignment->record->id);
        $pending = $ask->requirePending($assignment->expectedVersion);

        $isRecipient = $this->recipients->resolve($pending)
            ->map(fn (ActorReference $actor) => AssigneeIdentity::ofActorReference($actor))
            ->map(fn (AssigneeIdentity $assignee) => $assignee->isSameAs($assignment->recipient))
            ->getOrElse(false);

        if (! $isRecipient) {
            throw AskRefused::routeChanged();
        }
    }

    /**
     * @param  list<class-string>  $commands
     */
    private function runsAny(array $commands): bool
    {
        return array_any($commands, fn (string $command) => $this->nesting->runs($command));
    }

    private function requireRouteEditor(Ask $ask): void
    {
        $actor = $this->actors->actor();

        if (! $ask->actor()->isSameAs($actor) && ! $this->owner->resolve()->endsAt($actor)) {
            throw AskRefused::routeChanged();
        }
    }
}
