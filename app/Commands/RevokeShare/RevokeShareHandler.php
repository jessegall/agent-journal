<?php

declare(strict_types=1);

namespace App\Commands\RevokeShare;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sharing\SharePolicy;
use App\Models\Sharing\Share;
use App\Support\ActorIdentity;
use App\Support\ShareEndings;
use App\Support\ShareSummary;

final readonly class RevokeShareHandler implements CommandHandler
{
    public function __construct(
        private SharePolicy $policy,
        private ShareEndings $endings,
    ) {}

    public function handle(RevokeShareCommand $command): ShareSummary
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);
        $share = Share::lockForChange($command->shareId);
        $this->endings->revoke($share, ActorIdentity::of($owner));

        return $share->summary();
    }
}
