<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * What a fetch of an admitted run found: a run to start now, or one that started before and runs nothing again.
 */
enum AdmissionState: string
{
    case ToRun = 'to_run';
    case AlreadyStarted = 'already_started';
}
