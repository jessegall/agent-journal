<?php

declare(strict_types=1);

namespace App\Models\Concerns;

use App\Exceptions\ProfileRevisionImmutable;

/**
 * Keeps an appended profile revision immutable.
 */
trait PreventsRevisionUpdates
{
    protected static function bootPreventsRevisionUpdates(): void
    {
        static::updating(fn (self $revision) => throw ProfileRevisionImmutable::for($revision->id));
    }
}
