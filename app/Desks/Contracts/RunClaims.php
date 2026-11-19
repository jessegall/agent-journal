<?php

declare(strict_types=1);

namespace App\Desks\Contracts;

use PhpOption\Option;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Desks\Exceptions\RunClaimRefused;
use App\Records\Support\RecordIdentity;

/**
 * Who works on a run of some work: the actor holding the work itself, or an actor seated at the desk that holds it,
 * each claim kept with the exact proof it stands on.
 */
interface RunClaims
{
    /**
     * Claims the run for the actor, keeping its own valid claim and replacing a stale one. Work nobody holds is given
     * to the actor as it starts.
     *
     * @throws RunClaimRefused
     */
    public function take(RecordIdentity $run, RecordIdentity $work, ActorIdentity $actor): AssignmentReference;

    /**
     * The actor whose claim on each run is still valid, keyed by run id; a run with no valid claim is left out.
     * The runs are of one record type.
     *
     * @param  list<RecordIdentity>  $runs
     * @return array<string, ActorIdentity>
     */
    public function holdersOf(array $runs): array;

    /**
     * The actor whose claim on the run still stands, when there is one.
     *
     * @return Option<ActorIdentity>
     */
    public function holderOf(RecordIdentity $run): Option;

    public function release(RecordIdentity $run): void;
}
