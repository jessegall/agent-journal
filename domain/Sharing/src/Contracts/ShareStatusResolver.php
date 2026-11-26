<?php

declare(strict_types=1);

namespace Domain\Sharing\Contracts;

use App\Support\RecordIdentity;

/**
 * Whether a record is public now: the root of a live, unexpired share, or a linked record its current scope approves.
 */
interface ShareStatusResolver
{
    /**
     * Whether the record is in a live public share.
     */
    public function isPubliclyShared(RecordIdentity $record): bool;
}
