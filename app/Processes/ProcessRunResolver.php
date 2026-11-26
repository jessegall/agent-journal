<?php

declare(strict_types=1);

namespace App\Processes;

use App\Models\Runs\ProcessRun;
use App\Processes\Contracts\ProcessRunResolver as ProcessRunResolverContract;
use App\Support\ActorReference;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads who opened a run of the selected project from the run's own row.
 */
final readonly class ProcessRunResolver implements ProcessRunResolverContract
{
    public function actorOf(string $runId): Option
    {
        $run = ProcessRun::query()->whereKey($runId)->first();

        if ($run === null || $run->actor_type === null || $run->actor_id === null) {
            return None::create();
        }

        return Some::create(ActorReference::fromStored($run->actor_type, $run->actor_id));
    }
}
