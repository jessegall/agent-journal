<?php

declare(strict_types=1);

namespace App\Assignments\Storage;

use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentChange;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\ConnectionInterface;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Core's private writes and reads of the one current holder per record. Every call runs inside an assignment
 * transaction; the writer and retirement decide who may do what before they call it.
 */
final readonly class AssignmentStore implements AssignmentStorage
{
    public function __construct(private ConnectionInterface $database) {}

    /**
     * The record's current assignment, its row locked for update.
     *
     * @return Option<Assignment>
     */
    public function lockCurrent(RecordIdentity $record): Option
    {
        $this->requireTransaction();
        $row = AssignmentRecord::query()->forRecord($record)->lockForUpdate()->first();

        return $row === null ? None::create() : Some::create($row->toAssignment());
    }

    /**
     * The record's current assignment, locked, when it is still the one the caller read.
     *
     * @throws AssignmentConflict
     */
    public function lockExpected(RecordIdentity $record, AssignmentReference $expected): Assignment
    {
        $current = $this->lockCurrent($record);

        if ($current->isEmpty() || ! $current->get()->reference->isSameAs($expected)) {
            throw AssignmentConflict::staleReference($record);
        }

        return $current->get();
    }

    /**
     * Gives an unheld record to the holder and answers the record's assignment afterwards: the new one, or the one
     * another transaction made first. The unique record key decides the winner without aborting this transaction; a
     * winner this snapshot cannot see raises a serialization failure, and the transaction runs again.
     */
    public function assignIfUnheld(RecordIdentity $record, AssigneeIdentity $holder): Assignment
    {
        $this->requireTransaction();
        AssignmentRecord::insertUnlessHeld($record, $holder);

        return AssignmentRecord::query()->forRecord($record)->lockForUpdate()->firstOrFail()->toAssignment();
    }

    /**
     * Replaces the record's assignment with a new row for the holder, so the old reference no longer matches.
     */
    public function replace(Assignment $current, AssigneeIdentity $holder): Assignment
    {
        $this->requireTransaction();
        AssignmentRecord::query()->whereKey($current->reference->id)->delete();

        return AssignmentRecord::holding($current->record, $holder)->toAssignment();
    }

    public function remove(Assignment $current): void
    {
        $this->requireTransaction();
        AssignmentRecord::query()->whereKey($current->reference->id)->delete();
    }

    /**
     * Removes every assignment the actor holds, of every record type, without asking any owner, for Core's retirement
     * of that actor.
     */
    public function releaseAll(AssigneeIdentity $holder): AssignmentResult
    {
        $this->requireTransaction();
        $rows = AssignmentRecord::query()
            ->heldForRetirement($holder)
            ->readAll('every assignment the retiring holder holds is released')
            ->orderBy('id')
            ->lockForUpdate()
            ->get();
        AssignmentRecord::query()->heldForRetirement($holder)->whereKey($rows->modelKeys())->delete();
        $released = array_values($rows->map(fn (AssignmentRecord $row) => $row->toAssignment())->all());

        return new AssignmentResult(
            array_map(
                fn (Assignment $assignment) => new AssignmentOutcome(
                    $assignment->record,
                    null,
                    AssignmentOutcomeType::Changed,
                ),
                $released,
            ),
            array_map(
                fn (Assignment $assignment) => new AssignmentChange($assignment->record, $assignment, null),
                $released,
            ),
        );
    }

    /**
     * @throws AssignmentTransactionRequired
     */
    private function requireTransaction(): void
    {
        if ($this->database->transactionLevel() === 0) {
            throw AssignmentTransactionRequired::forStore();
        }
    }
}
