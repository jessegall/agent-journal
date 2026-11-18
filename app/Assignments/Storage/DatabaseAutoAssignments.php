<?php

declare(strict_types=1);

namespace App\Assignments\Storage;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Actions\AutoAssignmentStatuses;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentReader;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Exceptions\AutoAssignmentMissing;
use App\Assignments\Exceptions\AutoAssignmentRevisionChanged;
use App\Assignments\Models\AutoAssignment;
use App\Assignments\Support\AutoAssignmentChange;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentPage;
use App\Assignments\Support\AutoAssignmentStatus;
use App\Assignments\Support\Page;
use PhpOption\Option;

/**
 * The auto-assignments kept in their table: read by key or by page, and changed only inside the bus's repeatable-read
 * transaction against the revision the caller read.
 */
final readonly class DatabaseAutoAssignments implements AutoAssignmentReader, AutoAssignmentWriter
{
    public function __construct(
        private AssignmentTransaction $transaction,
        private CurrentActor $actors,
        private AutoAssignmentAccess $access,
        private AutoAssignmentStatuses $statuses,
    ) {}

    public function forActor(AutoAssignmentKey $key): Option
    {
        return Option::fromValue(AutoAssignment::query()->forKey($key)->first())
            ->map(fn (AutoAssignment $row) => $row->toFact());
    }

    public function status(AutoAssignmentKey $key): AutoAssignmentStatus
    {
        $this->access->requireRead($this->actors->actor(), $key->actor);
        $row = AutoAssignment::query()->forKey($key)->first();

        if ($row === null) {
            return AutoAssignmentStatus::never();
        }

        return $this->statuses->of($row);
    }

    public function enabled(Page $page): AutoAssignmentPage
    {
        return AutoAssignment::enabledPage($page);
    }

    public function listFor(ActorIdentity $actor, Page $page): AutoAssignmentPage
    {
        return AutoAssignment::pageFor($actor, $page);
    }

    public function enable(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->requireOpen();
        $existing = AutoAssignment::lockedFor($input->key);

        if ($existing->isEmpty()) {
            return $this->enableFirst($input, $expectedRevision);
        }

        $row = $existing->get();
        $row->requireRevision($expectedRevision);
        $changed = $row->configure(true, $input->pool, $input->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function configure(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->requireOpen();
        $row = AutoAssignment::lockedFor($input->key)->getOrThrow(AutoAssignmentMissing::forKey($input->key));
        $row->requireRevision($expectedRevision);
        $changed = $row->configure($row->enabled, $input->pool, $input->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function disable(AutoAssignmentKey $key, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->requireOpen();
        $existing = AutoAssignment::lockedFor($key);

        if ($existing->isEmpty()) {
            return $this->unchangedMissing($expectedRevision);
        }

        $row = $existing->get();
        $row->requireRevision($expectedRevision);
        $changed = $row->configure(false, $row->pool, $row->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    /**
     * @throws AutoAssignmentRevisionChanged
     */
    private function enableFirst(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->unchangedMissing($expectedRevision);
        $row = AutoAssignment::enableFirst($input);

        return new AutoAssignmentChange(true, $row->configuration_revision);
    }

    /**
     * A missing auto-assignment is off at revision 0; any other expected revision is stale.
     *
     * @throws AutoAssignmentRevisionChanged
     */
    private function unchangedMissing(int $expectedRevision): AutoAssignmentChange
    {
        if ($expectedRevision !== 0) {
            throw AutoAssignmentRevisionChanged::for($expectedRevision, 0);
        }

        return new AutoAssignmentChange(false, 0);
    }
}
