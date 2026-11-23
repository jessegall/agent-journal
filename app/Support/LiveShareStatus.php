<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sharing\ShareStatusResolver;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareMember;

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
