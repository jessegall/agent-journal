<?php

declare(strict_types=1);

namespace App\Core\Assignments\Storage;

use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Enums\AssignmentOutcomeKind;
use App\Core\Assignments\Exceptions\AssignmentTransactionRequired;
use App\Core\Assignments\Models\AssignmentRecord;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentChange;
use App\Core\Assignments\Support\AssignmentOutcome;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\RecordIdentity;
use Illuminate\Database\ConnectionInterface;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Core's private writes and reads of the one current holder per record. Every call runs inside an assignment
 * transaction; the writer and retirement decide who may do what before they call it.
 */
final readonly class AssignmentStore
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
     * Gives an unheld record to the holder and answers the record's assignment afterwards: the new one, or the one
     * another transaction made first. The unique record key decides the winner without aborting this transaction; a
     * winner this snapshot cannot see raises a serialization failure, and the transaction runs again.
     */
    public function assignIfUnheld(RecordIdentity $record, ActorIdentity $holder): Assignment
    {
        $this->requireTransaction();
        $this->database->insert(
            'INSERT INTO assignments (record_type, record_id, holder_kind, holder_id, created_at, updated_at) VALUES (?, ?, ?, ?, now(), now()) ON CONFLICT (record_type, record_id) DO NOTHING',
            [$record->type, $record->id, $holder->kind->value, $holder->id],
        );

        return AssignmentRecord::query()->forRecord($record)->lockForUpdate()->firstOrFail()->toAssignment();
    }

    /**
     * Replaces the record's assignment with a new row for the holder, so the old reference no longer matches.
     */
    public function replace(Assignment $current, ActorIdentity $holder): Assignment
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
    public function releaseAll(ActorIdentity $holder): AssignmentResult
    {
        $this->requireTransaction();
        $rows = AssignmentRecord::query()->heldForRetirement($holder)->orderBy('id')->lockForUpdate()->get();
        AssignmentRecord::query()->heldForRetirement($holder)->whereKey($rows->modelKeys())->delete();
        $released = array_values($rows->map(fn (AssignmentRecord $row) => $row->toAssignment())->all());

        return new AssignmentResult(
            array_map(fn (Assignment $assignment) => new AssignmentOutcome($assignment->record, None::create(), AssignmentOutcomeKind::Changed), $released),
            array_map(fn (Assignment $assignment) => new AssignmentChange($assignment->record, Some::create($assignment), None::create()), $released),
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
