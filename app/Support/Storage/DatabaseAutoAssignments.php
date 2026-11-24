<?php

declare(strict_types=1);

namespace App\Support\Storage;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Assignments\AutoAssignmentWriter;
use App\Contracts\Time\ServerClock;
use App\Exceptions\AutoAssignmentMissing;
use App\Exceptions\AutoAssignmentRevisionChanged;
use App\Models\Records\AutoAssignment;
use App\Support\ActorIdentity;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentOutcome;
use App\Support\AutoAssignmentPage;
use App\Support\AutoAssignmentStatus;
use App\Support\AutoAssignmentStatuses;
use App\Support\IdListPage;
use Closure;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The auto-assignments kept in their table: read by key or by page, and changed only inside the bus's repeatable-read
 * transaction against the revision the caller read.
 */
final readonly class DatabaseAutoAssignments implements AutoAssignmentResolver, AutoAssignmentWriter
{
    public function __construct(
        private AssignmentTransaction $transaction,
        private CurrentActor $actors,
        private AutoAssignmentAccess $access,
        private AutoAssignmentStatuses $statuses,
        private ServerClock $clock,
    ) {}

    public function forActor(AutoAssignmentKey $key): Option
    {
        $row = AutoAssignment::query()->forKey($key)->first();

        if ($row === null) {
            return None::create();
        }

        return Some::create($row->toFact());
    }

    public function status(AutoAssignmentKey $key): AutoAssignmentStatus
    {
        $this->access->assertMayRead($this->actors->actor(), $key->actor);
        $row = AutoAssignment::query()->forKey($key)->first();

        if ($row === null) {
            return AutoAssignmentStatus::never();
        }

        return $this->statuses->of($row);
    }

    public function enabled(IdListPage $page): AutoAssignmentPage
    {
        return AutoAssignment::enabledPage($page);
    }

    public function listFor(ActorIdentity $actor, IdListPage $page): AutoAssignmentPage
    {
        return AutoAssignment::pageFor($actor, $page);
    }

    public function enable(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->assertOpen();
        $existing = AutoAssignment::lockedFor($input->key);

        if ($existing->isEmpty()) {
            return $this->enableFirst($input, $expectedRevision);
        }

        $row = $existing->get();
        $this->assertAtRevision($row, $expectedRevision);
        $changed = $row->configure(true, $input->pool, $input->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function configure(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->assertOpen();
        $row = AutoAssignment::lockedFor($input->key)->getOrThrow(AutoAssignmentMissing::forKey($input->key));
        $this->assertAtRevision($row, $expectedRevision);
        $changed = $row->configure($row->enabled, $input->pool, $input->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function disable(AutoAssignmentKey $key, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->assertOpen();
        $existing = AutoAssignment::lockedFor($key);

        if ($existing->isEmpty()) {
            return $this->unchangedMissing($expectedRevision);
        }

        $row = $existing->get();
        $this->assertAtRevision($row, $expectedRevision);
        $changed = $row->configure(false, $row->pool, $row->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function claim(AutoAssignmentKey $key, Closure $claim): AutoAssignmentOutcome
    {
        $this->transaction->assertOpen();
        $row = AutoAssignment::lockedFor($key);

        if ($row->isEmpty() || ! $row->get()->enabled) {
            return AutoAssignmentOutcome::off();
        }

        $assignment = $row->get();
        $outcome = $claim($assignment->toFact());

        if ($outcome->isAssigned()) {
            $assignment->markServedAt($this->clock->now());
        }

        return $outcome;
    }

    /**
     * @throws AutoAssignmentRevisionChanged
     */
    private function enableFirst(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->unchangedMissing($expectedRevision);
        $row = AutoAssignment::create($input);

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

    /**
     * @throws AutoAssignmentRevisionChanged
     */
    private function assertAtRevision(AutoAssignment $row, int $expectedRevision): void
    {
        if (! $row->isAtRevision($expectedRevision)) {
            throw AutoAssignmentRevisionChanged::for($expectedRevision, $row->configuration_revision);
        }
    }
}
