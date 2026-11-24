<?php

declare(strict_types=1);

namespace App\Contracts\Admission;

use App\Enums\ShellDialect;
use App\Values\Admission;
use App\Values\AdmissionRefusal;
use App\Values\ExecutionContext;

/**
 * Decides a whole shell line for the calling actor before anything starts: every part must be known, permitted, timed
 * and, for a test, check or build, backed by its approved proven reader. The same request key returns the same
 * admission.
 */
interface ShellAdmission
{
    /**
     * Parses and judges a shell line an agent asked to run, and says whether it may run, and how, under the request
     * key.
     */
    public function admit(
        string $line,
        ShellDialect $dialect,
        ExecutionContext $context,
        string $requestKey,
    ): Admission;

    /**
     * The reason the rules do not let the line run where no supervised runner reaches, as in a session's own
     * container, or none: every part must be known, permitted and timed, and none may need its output kept. Nothing
     * is started or stored for a runner.
     */
    public function judge(string $line, ShellDialect $dialect, ExecutionContext $context): AdmissionRefusal|null;
}
