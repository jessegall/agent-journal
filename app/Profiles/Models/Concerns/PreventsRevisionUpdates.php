<?php

declare(strict_types=1);

namespace App\Profiles\Models\Concerns;

use App\Profiles\Exceptions\ProfileRevisionImmutable;

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
