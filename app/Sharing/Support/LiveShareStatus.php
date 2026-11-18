<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Records\Support\RecordIdentity;
use App\Sharing\Contracts\ShareStatusReader;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareMember;

/**
 * Reads whether a record is public from the live shares: as their root, or as an approved member of their current
 * scope.
 */
final readonly class LiveShareStatus implements ShareStatusReader
{
    public function isPubliclyShared(RecordIdentity $record): bool
    {
        return Share::liveFor($record)->isDefined() || ShareMember::isApprovedInLiveShare($record);
    }
}
