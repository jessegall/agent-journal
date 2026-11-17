<?php

declare(strict_types=1);

namespace App\Core\Assignments\Actions;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Contracts\AgentAuthority;
use App\Core\Assignments\Actions\Support\AssignmentBatch;
use App\Core\Assignments\Contracts\AssignmentProviders;
use App\Core\Assignments\Contracts\AssignmentTransaction;
use App\Core\Assignments\Contracts\AssignmentWriter;
use App\Core\Assignments\Enums\AssignmentOutcomeKind;
use App\Core\Assignments\Enums\AssignmentReason;
use App\Core\Assignments\Exceptions\AssignmentConflict;
use App\Core\Assignments\Exceptions\AssignmentRootFinished;
use App\Core\Assignments\Storage\AssignmentStore;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentChange;
use App\Core\Assignments\Support\AssignmentFacts;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\AssignmentOutcome;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\RecordIdentity;
use App\Core\Actors\Contracts\CurrentActor;
use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The assignment writer: in one repeatable-read transaction it checks the caller may give out work and the
 * recipient may receive it, taking their shared lifecycle locks in kind and id order, takes the record from its
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
        return $this->transaction->run(function () use ($record, $recipient): AssignmentResult {
            $this->checkActors($recipient);
            $this->providers->recordProvider($record->type)->requireAssignable($record);
            $current = $this->store->lockCurrent($record);

            if ($current->isDefined()) {
                return $this->unchangedIfHeldBy($current->get(), $recipient);
            }

            return $this->changed(AssignmentReason::Assigned, $record, None::create(), Some::create($this->store->assignIfUnheld($record, $recipient)));
        });
    }

    public function reassign(RecordIdentity $record, AssignmentReference $expected, ActorIdentity $recipient): AssignmentResult
    {
        return $this->transaction->run(function () use ($record, $expected, $recipient): AssignmentResult {
            $this->checkActors($recipient);
            $this->providers->recordProvider($record->type)->requireAssignable($record);
            $current = $this->requireExpected($record, $expected);

            if ($current->holder()->isSameAs($recipient)) {
                return $this->unchanged($current);
            }

            return $this->changed(AssignmentReason::Reassigned, $record, Some::create($current), Some::create($this->store->replace($current, $recipient)));
        });
    }

    public function unassign(RecordIdentity $record, AssignmentReference $expected): AssignmentResult
    {
        return $this->transaction->run(function () use ($record, $expected): AssignmentResult {
            $this->checkActors(null);
            $this->providers->recordProvider($record->type)->requireAssignable($record);

            if ($this->store->lockCurrent($record)->isEmpty()) {
                return new AssignmentResult([new AssignmentOutcome($record, None::create(), AssignmentOutcomeKind::Unchanged)], []);
            }

            $current = $this->requireExpected($record, $expected);
            $this->store->remove($current);

            return $this->changed(AssignmentReason::Unassigned, $record, Some::create($current), None::create());
        });
    }

    public function assignUnfinished(ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        return $this->transaction->run(function () use ($recipient, $records): AssignmentResult {
            $this->checkActors($recipient);
            [$group, $finished] = $this->checkedGroup($records);
            $root = $this->store->lockCurrent($group->root);

            if ($root->isDefined() && ! $root->get()->holder()->isSameAs($recipient)) {
                throw AssignmentConflict::heldByAnother($group->root);
            }

            return $this->published(AssignmentReason::Assigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->giveTo($record, $recipient)));
        });
    }

    public function reassignUnfinished(AssignmentReference $expectedRoot, ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        return $this->transaction->run(function () use ($expectedRoot, $recipient, $records): AssignmentResult {
            $this->checkActors($recipient);
            [$group, $finished] = $this->checkedGroup($records);
            $this->requireExpected($group->root, $expectedRoot);

            return $this->published(AssignmentReason::Reassigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->giveTo($record, $recipient)));
        });
    }

    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult
    {
        return $this->transaction->run(function () use ($expectedRoot, $records): AssignmentResult {
            $this->checkActors(null);
            [$group, $finished] = $this->checkedGroup($records);
            $this->requireExpected($group->root, $expectedRoot);

            return $this->published(AssignmentReason::Unassigned, $this->each($group, $finished, fn (RecordIdentity $record) => $this->batch->clear($record)));
        });
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
     * Checks the caller and the recipient, each under its shared lifecycle lock, in kind and id order so two commands
     * never take them in opposite orders.
     */
    private function checkActors(ActorIdentity|null $recipient): void
    {
        $caller = ActorIdentity::of($this->actors->actor());
        $actors = array_filter([$caller, $recipient]);
        usort($actors, fn (ActorIdentity $one, ActorIdentity $other) => [$one->kind->value, $one->id] <=> [$other->kind->value, $other->id]);

        foreach ($actors as $actor) {
            if ($actor === $caller && $caller->kind === ActorKind::Agent) {
                $this->authority->requireDispatcher($caller->id);
            }

            if ($actor === $recipient) {
                $this->providers->assigneeProvider($recipient->kind)->requireEligible($recipient);
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
        return new AssignmentResult([new AssignmentOutcome($current->record, Some::create($current), AssignmentOutcomeKind::Unchanged)], []);
    }

    /**
     * @param  Option<Assignment>  $before
     * @param  Option<Assignment>  $after
     */
    private function changed(AssignmentReason $reason, RecordIdentity $record, Option $before, Option $after): AssignmentResult
    {
        $result = new AssignmentResult(
            [new AssignmentOutcome($record, $after, AssignmentOutcomeKind::Changed)],
            [new AssignmentChange($record, $before, $after)],
        );
        $this->facts->publish(ActorIdentity::of($this->actors->actor()), $reason, $result);

        return $result;
    }
}
