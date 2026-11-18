<?php

declare(strict_types=1);

namespace App\Processes\Contracts;

use App\Processes\Enums\ShellDialect;
use App\Processes\Values\Admission;
use App\Processes\Values\ExecutionContext;

/**
 * Decides a whole shell line for the calling actor before anything starts: every part must be known, permitted, timed
 * and, for a test, check or build, backed by its approved proven reader. The same request key returns the same
 * admission.
 */
interface ShellAdmission
{
    public function admit(
        string $line,
        ShellDialect $dialect,
        ExecutionContext $context,
        string $requestKey,
    ): Admission;
}
