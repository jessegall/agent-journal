<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Actions\WriteAssignments;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AssignmentWriter;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Records\Support\RecordIdentity;
use Closure;

/**
 * Core's assignment writer with the repeatable-read transaction the command bus gives it in the application, for the
 * tests that judge the writer's own rules rather than the bus.
 */
final readonly class AssignmentWriterInTransaction implements AssignmentWriter
{
    public function __construct(private WriteAssignments $writer, private AssignmentTransaction $transaction) {}

    public function assign(RecordIdentity $record, ActorIdentity $recipient): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->assign($record, $recipient));
    }

    public function reassign(RecordIdentity $record, AssignmentReference $expected, ActorIdentity $recipient): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->reassign($record, $expected, $recipient));
    }

    public function unassign(RecordIdentity $record, AssignmentReference $expected): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->unassign($record, $expected));
    }

    public function assignUnfinished(ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->assignUnfinished($recipient, $records));
    }

    public function reassignUnfinished(AssignmentReference $expectedRoot, ActorIdentity $recipient, Closure $records): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->reassignUnfinished($expectedRoot, $recipient, $records));
    }

    public function unassignUnfinished(AssignmentReference $expectedRoot, Closure $records): AssignmentResult
    {
        return $this->transaction->run(fn () => $this->writer->unassignUnfinished($expectedRoot, $records));
    }
}
