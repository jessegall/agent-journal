<?php

declare(strict_types=1);

namespace App\Assignments\Actions\Support;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;
use Closure;

/**
 * The steps of a batch command over a group its owner collected: check every record with its owner, learn which are
 * finished with one call per owner, and give, clear or skip each record. The writer decides the root's rule.
 */
final readonly class AssignmentBatch
{
    public function __construct(
        private AssignmentProviders $providers,
        private AssignmentStore $store,
    ) {}

    /**
     * Runs the owner's database-only collection, checks every record under a key-share lock and returns the group
     * with the records whose work is finished.
     *
     * @param  Closure(): AssignmentGroup  $records
     * @return array{AssignmentGroup, list<RecordIdentity>}
     */
    public function checkedGroup(Closure $records): array
    {
        $group = $records();
        $byType = [];

        foreach ($group->records as $record) {
            $byType[$record->type][] = $this->providers->recordProvider($record->type)->requireAssignable($record);
        }

        $finished = [];

        foreach ($byType as $type => $assignables) {
            array_push($finished, ...$this->providers->recordProvider($type)->finishedRecords($assignables));
        }

        return [$group, $finished];
    }

    /**
     * @param  list<RecordIdentity>  $finished
     */
    public function isFinished(RecordIdentity $record, array $finished): bool
    {
        return array_any($finished, fn (RecordIdentity $over) => $over->isSameAs($record));
    }

    /**
     * Gives the record to the recipient: fills it when unheld, replaces another holder, leaves the same holder.
     */
    public function giveTo(RecordIdentity $record, AssigneeIdentity $recipient): AssignmentResult
    {
        $current = $this->store->lockCurrent($record);

        if ($current->isEmpty()) {
            $after = $this->store->assignIfUnheld($record, $recipient);

            return new AssignmentResult([new AssignmentOutcome($record, $after, AssignmentOutcomeType::Changed)], [new AssignmentChange($record, null, $after)]);
        }

        if ($current->get()->holder()->isSameAs($recipient)) {
            return new AssignmentResult([new AssignmentOutcome($record, $current->get(), AssignmentOutcomeType::Unchanged)], []);
        }

        $after = $this->store->replace($current->get(), $recipient);

        return new AssignmentResult([new AssignmentOutcome($record, $after, AssignmentOutcomeType::Changed)], [new AssignmentChange($record, $current->get(), $after)]);
    }

    public function clear(RecordIdentity $record): AssignmentResult
    {
        $current = $this->store->lockCurrent($record);

        if ($current->isEmpty()) {
            return new AssignmentResult([new AssignmentOutcome($record, null, AssignmentOutcomeType::Unchanged)], []);
        }

        $this->store->remove($current->get());

        return new AssignmentResult([new AssignmentOutcome($record, null, AssignmentOutcomeType::Changed)], [new AssignmentChange($record, $current->get(), null)]);
    }

    public function skip(RecordIdentity $record): AssignmentResult
    {
        return new AssignmentResult([new AssignmentOutcome($record, $this->store->lockCurrent($record)->getOrElse(null), AssignmentOutcomeType::SkippedFinished)], []);
    }
}
