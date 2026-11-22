<?php

declare(strict_types=1);

namespace App\Contracts;

use App\Support\RecordIdentity;

/**
 * Whether a record is public now: the root of a live, unexpired share, or a linked record its current scope approves.
 */
interface ShareStatusResolver
{
    public function isPubliclyShared(RecordIdentity $record): bool;
}
