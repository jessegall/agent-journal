<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\InspectMergeAttempts;
use App\Agents\Commands\MergeReviewedWork;
use App\Assignments\Contracts\Assignable;
use App\Assignments\Contracts\JournalAssignableProvider;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\JournalAssignment;
use App\Bus\Support\CommandNesting;
use App\Records\Support\RecordIdentity;
use App\Supervision\Commands\AdvanceAsk;
use App\Supervision\Commands\ApproveCodeReview;
use App\Supervision\Commands\CloseWorkChain;
use App\Supervision\Commands\HandOffCodeReview;
use App\Supervision\Commands\ReplyToAsk;
use App\Supervision\Commands\ResolveMergeAttempt;
use App\Supervision\Commands\ReturnCodeReview;
use App\Supervision\Commands\RouteAsk;
use App\Supervision\Commands\SettleMergeOutcomes;
use App\Supervision\Commands\WithdrawAsk;
use App\Supervision\Commands\WithdrawWorkChain;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Models\Ask;
use App\Supervision\Values\AskReference;

final readonly class AskAssignments implements JournalAssignableProvider
{
    /**
     * The commands that route an ask to its first holder: routing it, and the review chain opening its own asks; a
     * merge's settlement may open a repair's stuck ask.
     */
    private const array ROUTING_COMMANDS = [
        RouteAsk::class,
        HandOffCodeReview::class,
        ApproveCodeReview::class,
        ReturnCodeReview::class,
        MergeReviewedWork::class,
        InspectMergeAttempts::class,
        SettleMergeOutcomes::class,
        ResolveMergeAttempt::class,
    ];

    /**
     * The engine's commands that route an ask on its requester's behalf, as the review chain's maintenance.
     */
    private const array MAINTENANCE_ROUTING_COMMANDS = [
        HandOffCodeReview::class,
        InspectMergeAttempts::class,
        SettleMergeOutcomes::class,
    ];

    /**
     * The commands that end an ask for its holder: an answer, a withdrawal, a review decision or a merge's outcome.
     */
    private const array ANSWERING_COMMANDS = [
        ReplyToAsk::class,
        WithdrawAsk::class,
        ApproveCodeReview::class,
        ReturnCodeReview::class,
        MergeReviewedWork::class,
        InspectMergeAttempts::class,
        SettleMergeOutcomes::class,
        ResolveMergeAttempt::class,
        CloseWorkChain::class,
        WithdrawWorkChain::class,
    ];

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
        if ($this->nesting->runs(AdvanceAsk::class)) {
            $this->requireEscalationRecipient($assignment);

            return;
        }

        if (! $this->runsAny(self::ROUTING_COMMANDS)) {
            throw AskRefused::routeChanged();
        }

        $this->graph->acquire();
        $handsOff = $this->runsAny(self::MAINTENANCE_ROUTING_COMMANDS);
        $ask = $handsOff
            ? Ask::lockedForMaintenance($assignment->record->id)
            : $this->asks->lock(new AskReference($assignment->record->id));

        if (! $handsOff) {
            $this->requireRouteEditor($ask);
        }

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
        $escalates = $this->nesting->runs(AdvanceAsk::class);

        if (! $escalates && ! $this->runsAny(self::ANSWERING_COMMANDS)) {
            throw AskRefused::routeChanged();
        }

        $ask = $escalates
            ? Ask::lockedForMaintenance($record->id)
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
        $found = $this->asks->visible()->whereKey($ids)->readLimit(count($ids))->pluck('id')->all();

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
        $ask = Ask::lockedForMaintenance($assignment->record->id);
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
