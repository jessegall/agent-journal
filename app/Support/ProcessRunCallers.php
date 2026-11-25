<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\ProcessRunCallers as ProcessRunCallersContract;
use App\Models\Runs\ProcessRun;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads who opened a run of the selected project from the run's own row.
 */
final readonly class ProcessRunCallers implements ProcessRunCallersContract
{
    public function callerOf(string $runId): Option
    {
        $run = ProcessRun::query()->whereKey($runId)->first();

        if ($run === null || $run->actor_type === null || $run->actor_id === null) {
            return None::create();
        }

        return Some::create(ActorReference::fromStored($run->actor_type, $run->actor_id));
    }
}
