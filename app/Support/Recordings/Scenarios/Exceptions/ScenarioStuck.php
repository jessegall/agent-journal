<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios\Exceptions;

use App\Support\Recordings\Scenarios\Enums\ScenarioFact;
use App\Support\Recordings\Scenarios\ScenarioRun;
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

    public static function hostNotRestarted(string $scenario, int $exitCode): self
    {
        return new self("The local host could not be restarted for {$scenario}: the restart ended with code {$exitCode}.");
    }

    public static function projectNotConnected(string $scenario, int $status): self
    {
        return new self("The local installer could not connect the project for {$scenario}. It exited with code {$status}.");
    }

    public static function terminalNotStarted(string $scenario, int $status): self
    {
        return new self("The terminal for {$scenario} did not open a session. Its launch returned {$status}.");
    }

    public static function keysRefused(ScenarioRun $run, string $reason): self
    {
        return new self("The host refused the terminal keys for {$run->scenario->name}: {$reason}.");
    }

    public static function keysNotObserved(ScenarioRun $run, string|null $source): self
    {
        $waiting = $source === null ? 'the key write answer' : "the key write answer and SessionStart from {$source}";

        return new self("The scenario {$run->scenario->name} did not record {$waiting}.");
    }

    public static function hostNotBack(string $scenario, int $seconds): self
    {
        return new self("The local host restarted for {$scenario} did not allow and check its images again within {$seconds} seconds.");
    }

    public static function quiet(ScenarioRun $run, ScenarioFact $fact, int $seconds): self
    {
        $place = $run->stepIndex() + 1;
        $quiet = "waiting for {$fact->value}, its session showed no life for {$seconds} seconds";

        return new self("The scenario {$run->scenario->name} is stuck at step {$place}: {$quiet}: {$run->sessionState()}.");
    }

    public static function ended(string $scenario, int $step, ScenarioFact $fact, string $reason): self
    {
        $place = $step + 1;

        return new self("The scenario {$scenario} is stuck at step {$place}: waiting for {$fact->value}, its session ended: {$reason}");
    }

    public static function at(string $scenario, int $step, ScenarioFact $fact, int $seconds): self
    {
        $place = $step + 1;

        $waited = "{$fact->value} did not happen in {$seconds} seconds";

        return new self("The scenario {$scenario} is stuck at step {$place}: {$waited}.");
    }
}
