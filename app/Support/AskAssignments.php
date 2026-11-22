<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\AdvanceAsk\AdvanceAskCommand;
use App\Commands\ApproveCodeReview\ApproveCodeReviewCommand;
use App\Commands\CloseWorkChain\CloseWorkChainCommand;
use App\Commands\HandOffCodeReview\HandOffCodeReviewCommand;
use App\Commands\InspectMergeAttempts\InspectMergeAttemptsCommand;
use App\Commands\MergeReviewedWork\MergeReviewedWorkCommand;
use App\Commands\ReplyToAsk\ReplyToAskCommand;
use App\Commands\ResolveMergeAttempt\ResolveMergeAttemptCommand;
use App\Commands\ReturnCodeReview\ReturnCodeReviewCommand;
use App\Commands\RouteAsk\RouteAskCommand;
use App\Commands\SettleMergeOutcomes\SettleMergeOutcomesCommand;
use App\Commands\WithdrawAsk\WithdrawAskCommand;
use App\Commands\WithdrawWorkChain\WithdrawWorkChainCommand;
use App\Contracts\Assignable;
use App\Contracts\CurrentActor;
use App\Contracts\JournalAssignableProvider;
use App\Exceptions\AskRefused;
use App\Models\Ask;
use App\Values\AskReference;

final readonly class AskAssignments implements JournalAssignableProvider
{
    /**
     * The commands that route an ask to its first holder: routing it, and the review chain opening its own asks; a
     * merge's settlement may open a repair's stuck ask.
     */
    private const array ROUTING_COMMANDS = [
        RouteAskCommand::class,
        HandOffCodeReviewCommand::class,
        ApproveCodeReviewCommand::class,
        ReturnCodeReviewCommand::class,
        MergeReviewedWorkCommand::class,
        InspectMergeAttemptsCommand::class,
        SettleMergeOutcomesCommand::class,
        ResolveMergeAttemptCommand::class,
    ];

    /**
     * The engine's commands that route an ask on its requester's behalf, as the review chain's maintenance.
     */
    private const array MAINTENANCE_ROUTING_COMMANDS = [
        HandOffCodeReviewCommand::class,
        InspectMergeAttemptsCommand::class,
        SettleMergeOutcomesCommand::class,
    ];

    /**
     * The commands that end an ask for its holder: an answer, a withdrawal, a review decision or a merge's outcome.
     */
    private const array ANSWERING_COMMANDS = [
        ReplyToAskCommand::class,
        WithdrawAskCommand::class,
        ApproveCodeReviewCommand::class,
        ReturnCodeReviewCommand::class,
        MergeReviewedWorkCommand::class,
        InspectMergeAttemptsCommand::class,
        SettleMergeOutcomesCommand::class,
        ResolveMergeAttemptCommand::class,
        CloseWorkChainCommand::class,
        WithdrawWorkChainCommand::class,
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
        if ($this->nesting->runs(AdvanceAskCommand::class)) {
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
        $escalates = $this->nesting->runs(AdvanceAskCommand::class);

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
