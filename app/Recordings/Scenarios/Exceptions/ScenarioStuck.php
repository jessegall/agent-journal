<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios\Exceptions;

use App\Recordings\Scenarios\Enums\ScenarioFact;
use RuntimeException;

/**
 * A scenario's wait-for step did not see its fact in time; the run's drafts are kept to read what happened.
 */
final class ScenarioStuck extends RuntimeException
{
    public static function machineChangeUnanswered(string $line, int $seconds): self
    {
        $script = 'is scripts/record-scenarios.sh running?';

        return new self("The record script did not run \"{$line}\" within {$seconds} seconds: {$script}");
    }

    public static function at(string $scenario, int $step, ScenarioFact $fact, int $seconds): self
    {
        $place = $step + 1;

        $waited = "{$fact->value} did not happen in {$seconds} seconds";

        return new self("The scenario {$scenario} is stuck at step {$place}: {$waited}.");
    }
}
