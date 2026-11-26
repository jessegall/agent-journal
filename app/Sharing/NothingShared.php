<?php

declare(strict_types=1);

namespace App\Sharing;

use App\Sharing\Contracts\ShareStatusResolver;
use App\Support\RecordIdentity;

/**
 * No record is shared: the answer when nothing lets records be shared publicly.
 */
final readonly class NothingShared implements ShareStatusResolver
{
    public function isPubliclyShared(RecordIdentity $record): bool
    {
        return false;
    }
}
