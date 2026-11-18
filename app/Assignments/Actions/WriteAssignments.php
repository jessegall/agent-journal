<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Actions\Support\AssignmentBatch;
use App\Assignments\Contracts\AgentAuthority;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentFacts;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;
use Closure;

/**
 * The assignment writer: in one repeatable-read transaction it checks the caller may give out work and the
 * recipient may receive it, taking their shared lifecycle locks in type and id order, takes the record from its
 * owner under a key-share lock, then changes the one holding and raises the one committed fact. The caller is always
 * the actor of this request.
 */
final readonly class WriteAssignments implements AssignmentWriter
{
    public function __construct(
        private CurrentActor $actors,
        private AgentAuthority $authority,
        private AssignmentProviders $providers,
        private AssignmentTransaction $transaction,
        private AssignmentStore $store,
        private AssignmentFacts $facts,
        private AssignmentBatch $batch,
    ) {}

    public function assign(RecordIdentity $record, ActorIdentity $recipient): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors($recipient);
        $this->providers->recordProvider($record->type)->requireAssignable($record);
        $current = $this->store->lockCurrent($record);

        if ($current->isDefined()) {
            return $this->unchangedIfHeldBy($current->get(), $recipient);
        }

        return $this->changed(AssignmentReason::Assigned, $record, null, $this->store->assignIfUnheld($record, $recipient));
    }

    public function reassign(RecordIdentity $record, AssignmentReference $expected, ActorIdentity $recipient): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors($recipient);
        $this->providers->recordProvider($record->type)->requireAssignable($record);
        $current = $this->requireExpected($record, $expected);

        if ($current->holder()->isSameAs($recipient)) {
            return $this->unchanged($current);
        }

        return $this->changed(AssignmentReason::Reassigned, $record, $current, $this->store->replace($current, $recipient));
    }

    public function unassign(RecordIdentity $record, AssignmentReference $expected): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors(null);
        $this->providers->recordProvider($record->type)->requireAssignable($record);

        if ($this->store->lockCurrent($record)->isEmpty()) {
            return new AssignmentResult([new AssignmentOutcome($record, null, AssignmentOutcomeType::Unchanged)], []);
        }

        $current = $this->requireExpected($record, $expected);
        $this->store->remove($current);

        return $this->changed(AssignmentReason::Unassigned, $record, $current, null);
    }

    public function assignUnfinished(ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors($recipient);
        [$group, $finished] = $this->checkedGroup($records);
        $root = $this->store->lockCurrent($group->root);

        if ($root->isDefined() && ! $root->get()->holder()->isSameAs($recipient)) {
            throw AssignmentConflict::heldByAnother($group->root);
        }

        return $this->published(AssignmentReason::Assigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->giveTo($record, $recipient)));
    }

    public function reassignUnfinished(AssignmentReference $expectedRoot, ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors($recipient);
        [$group, $finished] = $this->checkedGroup($records);
        $this->requireExpected($group->root, $expectedRoot);

        return $this->published(AssignmentReason::Reassigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->giveTo($record, $recipient)));
    }

    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->checkActors(null);
        [$group, $finished] = $this->checkedGroup($records);
        $this->requireExpected($group->root, $expectedRoot);

        return $this->published(AssignmentReason::Unassigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->clear($record)));
    }

    /**
     * The owner's group, every record checked, refused when its root is finished.
     *
     * @param  Closure(): AssignmentGroup  $records
     * @return array{AssignmentGroup, list<RecordIdentity>}
     */
    private function checkedGroup(Closure $records): array
    {
        [$group, $finished] = $this->batch->checkedGroup($records);

        if ($this->batch->isFinished($group->root, $finished)) {
            throw AssignmentRootFinished::for($group->root);
        }

        return [$group, $finished];
    }

    /**
     * Applies the change to the root and every unfinished record, and skips the finished ones.
     *
     * @param  list<RecordIdentity>  $finished
     * @param  Closure(RecordIdentity): AssignmentResult  $change
     */
    private function each(AssignmentGroup $group, array $finished, Closure $change): AssignmentResult
    {
        return AssignmentResult::combined(array_map(
            fn (RecordIdentity $record) => $this->batch->isFinished($record, $finished) ? $this->batch->skip($record) : $change($record),
            $group->records,
        ));
    }

    private function published(AssignmentReason $reason, AssignmentResult $result): AssignmentResult
    {
        $this->facts->publish(ActorIdentity::of($this->actors->actor()), $reason, $result);

        return $result;
    }

    /**
     * Checks the caller and the recipient, each under its shared lifecycle lock, in type and id order so two commands
     * never take them in opposite orders.
     */
    private function checkActors(ActorIdentity|null $recipient): void
    {
        $caller = ActorIdentity::of($this->actors->actor());
        $actors = array_filter([$caller, $recipient]);
        usort($actors, fn (ActorIdentity $one, ActorIdentity $other) => [$one->type->value, $one->id] <=> [$other->type->value, $other->id]);

        foreach ($actors as $actor) {
            if ($actor === $caller && $caller->type === ActorType::Agent) {
                $this->authority->requireDispatcher($caller->id);
            }

            if ($actor === $recipient) {
                $this->providers->assigneeProvider($recipient->type)->requireEligible($recipient);
            }
        }
    }

    private function requireExpected(RecordIdentity $record, AssignmentReference $expected): Assignment
    {
        $current = $this->store->lockCurrent($record);

        if ($current->isEmpty() || ! $current->get()->reference->isSameAs($expected)) {
            throw AssignmentConflict::staleReference($record);
        }

        return $current->get();
    }

    private function unchangedIfHeldBy(Assignment $current, ActorIdentity $recipient): AssignmentResult
    {
        if (! $current->holder()->isSameAs($recipient)) {
            throw AssignmentConflict::heldByAnother($current->record);
        }

        return $this->unchanged($current);
    }

    private function unchanged(Assignment $current): AssignmentResult
    {
        return new AssignmentResult([new AssignmentOutcome($current->record, $current, AssignmentOutcomeType::Unchanged)], []);
    }

    private function changed(AssignmentReason $reason, RecordIdentity $record, Assignment|null $before, Assignment|null $after): AssignmentResult
    {
        $result = new AssignmentResult(
            [new AssignmentOutcome($record, $after, AssignmentOutcomeType::Changed)],
            [new AssignmentChange($record, $before, $after)],
        );
        $this->facts->publish(ActorIdentity::of($this->actors->actor()), $reason, $result);

        return $result;
    }
}
