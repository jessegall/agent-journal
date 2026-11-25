<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Contracts\Sharing\ShareStatusResolver;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareMember;
use App\Support\RecordIdentity;

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
