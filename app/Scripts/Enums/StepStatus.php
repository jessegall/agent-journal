<?php

declare(strict_types=1);

namespace App\Scripts\Enums;

enum StepStatus: string
{
    case Completed = 'completed';
    case Failed = 'failed';
    case Pending = 'pending';
    case Uncertain = 'uncertain';

    /**
     * Whether a step with this status has no outcome yet: it is still owed or not known, so its run waits on it.
     */
    public function isUnresolved(): bool
    {
        return match ($this) {
            self::Pending, self::Uncertain => true,
            self::Completed, self::Failed => false,
        };
    }
}
