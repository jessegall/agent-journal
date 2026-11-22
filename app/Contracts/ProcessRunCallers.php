<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\ActorIdentity;
use PhpOption\Option;

/**
 * Who opened a process run of the current project, so another domain can bind the run to that caller's own work;
 * none for a run of another project, an unknown run, or a run opened by no actor.
 */
interface ProcessRunCallers
{
    /**
     * @return Option<ActorIdentity>
     */
    public function callerOf(string $runId): Option;
}
