<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Processes\ProcessRunCallers;
use App\Enums\ActorType;
use App\Models\Runs\ProcessRun;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * Reads who opened a run of the current project from the run's own row.
 */
final readonly class ProjectRunCallers implements ProcessRunCallers
{
    public function __construct(private ProjectKey $projects) {}

    public function callerOf(string $runId): Option
    {
        $run = ProcessRun::query()->withProjectKey($this->projects->current())->whereKey($runId)->first();

        if ($run === null || $run->actor_type === null || $run->actor_id === null) {
            return None::create();
        }

        return Some::create(new ActorIdentity(ActorType::from($run->actor_type), $run->actor_id));
    }
}
