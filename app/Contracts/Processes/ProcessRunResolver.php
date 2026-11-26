<?php

declare(strict_types=1);

namespace App\Contracts\Processes;

use App\Support\ActorReference;
use PhpOption\Option;

/**
 * Who opened a process run of the current project, so another domain can bind the run to that actor's own work;
 * none for a run of another project, an unknown run, or a run opened by no actor.
 */
interface ProcessRunResolver
{
    /**
     * @return Option<ActorReference>
     */
    public function actorOf(string $runId): Option;
}
