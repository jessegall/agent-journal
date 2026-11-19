<?php

declare(strict_types=1);

namespace App\Sharing\Contracts;

use App\Records\Support\RecordIdentity;
use App\Sharing\Support\LiveShareStatus;
use Illuminate\Container\Attributes\Bind;

/**
 * Whether a record is public now: the root of a live, unexpired share, or a linked record its current scope approves.
 */
#[Bind(LiveShareStatus::class)]
interface ShareStatusResolver
{
    public function isPubliclyShared(RecordIdentity $record): bool;
}
