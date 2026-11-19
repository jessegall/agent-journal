<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Actions\Support\AssignmentBatch;
use App\Assignments\Contracts\AssignmentAdmission;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Enums\AssignmentReason;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentRootFinished;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssigneeIdentity;
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
        private CurrentAuthorizer $authorizer,
        private AssignmentProviders $providers,
        private AssignmentTransaction $transaction,
        private AssignmentStore $store,
        private AssignmentFacts $facts,
        private AssignmentBatch $batch,
        private AssignmentAdmission $admission,
    ) {}

    public function assign(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult
    {
        $this->transaction->requireOpen();
        $admitted = $this->admission->admitPublic($record, $recipient);
        $current = $this->store->lockCurrent($record);

        if ($current->isDefined()) {
            return $this->unchangedIfHeldBy($current->get(), $admitted->resolved)->forRequest($admitted->request());
        }

        $after = $this->store->assignIfUnheld($record, $admitted->resolved);

        return $this->changed(AssignmentReason::Assigned, $record, null, $after)->forRequest($admitted->request());
    }

    public function reassign(
        RecordIdentity $record,
        AssignmentReference $expected,
        AssigneeIdentity $recipient,
    ): AssignmentResult {
        $this->transaction->requireOpen();
        $admitted = $this->admission->admitPublic($record, $recipient);
        $current = $this->store->lockExpected($record, $expected);

        if ($current->holder()->isSameAs($admitted->resolved)) {
            return $this->unchanged($current)->forRequest($admitted->request());
        }

        $after = $this->store->replace($current, $admitted->resolved);

        return $this->changed(AssignmentReason::Reassigned, $record, $current, $after)->forRequest($admitted->request());
    }

    public function unassign(RecordIdentity $record, AssignmentReference $expected): AssignmentResult
    {
        $this->providers->requirePublic($record->type);
        $this->transaction->requireOpen();
        $this->requireUnassign();
        $this->providers->recordProvider($record->type)->requireAssignable($record);

        if ($this->store->lockCurrent($record)->isEmpty()) {
            return new AssignmentResult([new AssignmentOutcome($record, null, AssignmentOutcomeType::Unchanged)], []);
        }

        $current = $this->store->lockExpected($record, $expected);
        $this->store->remove($current);

        return $this->changed(AssignmentReason::Unassigned, $record, $current, null);
    }

    public function assignUnfinished(AssigneeIdentity $recipient, Closure $records): AssignmentResult
    {
        $this->transaction->requireOpen();
        [$group, $finished] = $this->checkedGroup($records);
        $admitted = $this->admission->admitPublic($group->root, $recipient);
        $root = $this->store->lockCurrent($group->root);

        if ($root->isDefined() && ! $root->get()->holder()->isSameAs($admitted->resolved)) {
            throw AssignmentConflict::heldByAnother($group->root);
        }

        return $this->published(AssignmentReason::Assigned, $this->each(
            $group,
            $finished,
            fn (RecordIdentity $record) => $this->batch->giveTo($record, $admitted->resolved),
        ))->forRequest($admitted->request());
    }

    public function reassignUnfinished(
        AssignmentReference $expectedRoot,
        AssigneeIdentity $recipient,
        Closure $records,
    ): AssignmentResult {
        $this->transaction->requireOpen();
        [$group, $finished] = $this->checkedGroup($records);
        $admitted = $this->admission->admitPublic($group->root, $recipient);
        $this->store->lockExpected($group->root, $expectedRoot);

        return $this->published(AssignmentReason::Reassigned, $this->each(
            $group,
            $finished,
            fn (RecordIdentity $record) => $this->batch->giveTo($record, $admitted->resolved),
        ))->forRequest($admitted->request());
    }

    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult
    {
        $this->transaction->requireOpen();
        $this->requireUnassign();
        [$group, $finished] = $this->checkedGroup($records);
        $this->store->lockExpected($group->root, $expectedRoot);

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
     * Authorizes the caller for the write, then checks the recipient may hold work, before anything changes.
     */
    private function requireUnassign(): void
    {
        $this->authorizer->authorize(AssignmentPolicy::class, AssignmentPolicy::class, AssignmentAbility::Unassign);
    }

    private function unchangedIfHeldBy(Assignment $current, AssigneeIdentity $recipient): AssignmentResult
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
