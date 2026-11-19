<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\ResponsibilityWriter;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentReference;
use App\Records\Support\RecordIdentity;

/**
 * Writes internal responsibilities straight through the assignment store, which requires the caller's transaction.
 */
final readonly class WriteResponsibilities implements ResponsibilityWriter
{
    public function __construct(
        private AssignmentProviders $providers,
        private AssignmentStore $store,
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
        $this->providers->requireInternal($record->type);
    }
}
