<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\ShareStatusResolver;
use App\Models\Share;
use App\Models\ShareMember;

/**
 * Reads whether a record is public from the live shares: as their root, or as an approved member of their current
 * scope.
 */
final readonly class LiveShareStatus implements ShareStatusResolver
{
    public function isPubliclyShared(RecordIdentity $record): bool
    {
        return Share::liveFor($record)->isDefined() || ShareMember::isApprovedInLiveShare($record);
    }
}
