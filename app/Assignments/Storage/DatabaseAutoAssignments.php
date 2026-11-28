<?php

declare(strict_types=1);

namespace App\Assignments\Storage;

use App\Actors\Contracts\CurrentActor;
use App\Assignments\AutoAssignmentChange;
use App\Assignments\AutoAssignmentOutcome;
use App\Assignments\AutoAssignmentStatuses;
use App\Assignments\AutoAssignmentView;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Exceptions\AutoAssignmentMissing;
use App\Assignments\Exceptions\AutoAssignmentRevisionChanged;
use App\Models\Records\AutoAssignment;
use App\Support\ActorReference;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\CursorPage;
use App\Support\IdListPage;
use App\Time\Contracts\ServerClock;
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

    public function status(AutoAssignmentKey $key): AutoAssignmentView
    {
        $this->access->assertMayRead($this->actors->actor(), $key->actor);
        $row = AutoAssignment::query()->forKey($key)->first();

        if ($row === null) {
            return AutoAssignmentView::never();
        }

        return $this->statuses->of($row);
    }

    /** @return CursorPage<AutoAssignmentFact> */
    public function enabled(IdListPage $page): CursorPage
    {
        return AutoAssignment::resolveEnabledPage($page);
    }

    /** @return CursorPage<AutoAssignmentFact> */
    public function listFor(ActorReference $actor, IdListPage $page): CursorPage
    {
        return AutoAssignment::resolvePageFor($actor, $page);
    }

    public function enable(AutoAssignmentInput $input, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->assertOpen();
        $existing = AutoAssignment::findLockedFor($input->key);

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
        $row = AutoAssignment::findLockedFor($input->key)->getOrThrow(AutoAssignmentMissing::forKey($input->key));
        $this->assertAtRevision($row, $expectedRevision);
        $changed = $row->configure($row->enabled, $input->pool, $input->size);

        return new AutoAssignmentChange($changed, $row->configuration_revision);
    }

    public function disable(AutoAssignmentKey $key, int $expectedRevision): AutoAssignmentChange
    {
        $this->transaction->assertOpen();
        $existing = AutoAssignment::findLockedFor($key);

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
        $row = AutoAssignment::findLockedFor($key);

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
