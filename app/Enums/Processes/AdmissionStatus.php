<?php

declare(strict_types=1);

namespace App\Enums\Processes;

use App\Api\Processes\AdmissionAlreadyStarted;
use App\Api\Processes\AdmissionFetched;
use App\Api\Processes\StartableAdmission;

/**
 * What a fetch of an admitted run found: a run to start now, or one that started before and runs nothing again.
 */
enum AdmissionStatus: string
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
            self::ToRun => StartableAdmission::class,
            self::AlreadyStarted => AdmissionAlreadyStarted::class,
        };
    }
}
