<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\Asks\AdvanceAsk\AdvanceAskCommand;
use App\Commands\Asks\ReplyToAsk\ReplyToAskCommand;
use App\Commands\Asks\RouteAsk\RouteAskCommand;
use App\Commands\Asks\WithdrawAsk\WithdrawAskCommand;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\Assignable;
use App\Contracts\Assignments\JournalAssignableProvider as JournalAssignableProviderContract;
use App\Exceptions\AskRefused;
use App\Models\Asks\Ask;
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
        $found = $this->asks->visible()->whereKey($ids)->readExactly(count($ids))->pluck('id')->all();

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
            ->map(fn (ActorIdentity $actor) => AssigneeIdentity::ofActorIdentity($actor))
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
        $actor = ActorIdentity::of($this->actors->actor());

        if (! $ask->actor()->isSameAs($actor) && ! $this->owner->resolve()->endsAt($actor)) {
            throw AskRefused::routeChanged();
        }
    }
}
