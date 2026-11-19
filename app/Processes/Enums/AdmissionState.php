<?php

declare(strict_types=1);

namespace App\Processes\Enums;

use App\Processes\Calls\AdmissionAlreadyStarted;
use App\Processes\Calls\AdmissionFetched;
use App\Processes\Calls\AdmissionToStart;

/**
 * What a fetch of an admitted run found: a run to start now, or one that started before and runs nothing again.
 */
enum AdmissionState: string
{
    case ToRun = 'to_run';
    case AlreadyStarted = 'already_started';

    /**
     * The answer class a fetch in this state is read as.
     *
     * @return class-string<AdmissionFetched>
     */
    public function answerClass(): string
    {
        return match ($this) {
            self::ToRun => AdmissionToStart::class,
            self::AlreadyStarted => AdmissionAlreadyStarted::class,
        };
    }
}
