<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RevokeShare;

use App\Access\Contracts\SharePolicy;
use App\Models\Sharing\Share;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\ShareEndings;
use App\Sharing\Support\ShareSummary;

final readonly class RevokeShareHandler extends SharingCommandHandler
{
    public function __construct(
        private SharePolicy $policy,
        private ShareEndings $endings,
    ) {}

    public function handle(RevokeShareCommand $command): ShareSummary
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);
        $share = Share::ownForUpdate($command->shareId);
        $this->endings->revoke($share, $owner);

        return $share->summary;
    }
}
