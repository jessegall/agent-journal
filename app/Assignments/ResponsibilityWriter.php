<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\ResponsibilityWriter as ResponsibilityWriterContract;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Storage\AssignmentStorage;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;

/**
 * Writes internal responsibilities straight through the assignment store, which requires the caller's transaction.
 */
final readonly class ResponsibilityWriter implements ResponsibilityWriterContract
{
    public function __construct(
        private AssignmentProviders $providers,
        private AssignmentStorage $store,
    ) {}

    public function assign(RecordIdentity $record, AssigneeIdentity $holder): Assignment
    {
        $this->admit($record);

        if ($this->store->lockCurrent($record)->isDefined()) {
            throw AssignmentConflict::heldByAnother($record);
        }

        return $this->store->assignIfUnheld($record, $holder);
    }

    public function replace(RecordIdentity $record, AssignmentReference $expected, AssigneeIdentity $holder): Assignment
    {
        $this->admit($record);

        return $this->store->replace($this->store->lockExpected($record, $expected), $holder);
    }

    public function release(RecordIdentity $record, AssignmentReference $expected): void
    {
        $this->admit($record);
        $this->store->remove($this->store->lockExpected($record, $expected));
    }

    private function admit(RecordIdentity $record): void
    {
        $this->providers->assertInternal($record->type);
    }
}
