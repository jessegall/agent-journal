<?php

declare(strict_types=1);

namespace App\Enums;

use App\Support\Execution\StepStatus;

/**
 * Every exit status the journal decides itself when it runs a command line, by its name; a command's own exit code is
 * its own and never one of these unless it happens to share the number.
 */
enum ExitStatus: int
{
    case Success = 0;
    case Failure = 1;
    case CommandNotFound = 127;
    case Interrupted = 130;

    public function status(): StepStatus
    {
        return StepStatus::of($this);
    }
}
