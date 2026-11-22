<?php

declare(strict_types=1);

namespace App\Exceptions;

/**
 * The plan handed out for a run does not match the command line the journal admitted, so nothing starts.
 */
final class AdmittedPlanChanged extends CommandStopped
{
    public static function forRun(string $runId): self
    {
        return new self("The plan of run {$runId} does not match the admitted command line; nothing was started.");
    }
}
