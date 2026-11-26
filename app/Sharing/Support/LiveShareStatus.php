<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareMember;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Support\RecordIdentity;

/**
 * Reads whether a record is public from the live shares: as their root, or as an approved member of their current
 * scope.
 */
final readonly class LiveShareStatus implements ShareStatusResolver
{
    public function isPubliclyShared(RecordIdentity $record): bool
    {
        return Share::findLiveFor($record)->isDefined() || ShareMember::isApprovedInLiveShare($record);
    }
}
