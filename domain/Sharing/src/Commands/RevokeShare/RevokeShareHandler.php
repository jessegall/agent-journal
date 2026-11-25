<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RevokeShare;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sharing\SharePolicy;
use Domain\Sharing\Models\Share;
use App\Support\ActorIdentity;
use Domain\Sharing\Support\ShareEndings;
use Domain\Sharing\Support\ShareSummary;

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
        $share = Share::ownForUpdate($command->shareId);
        $this->endings->revoke($share, ActorIdentity::of($owner));

        return $share->summary;
    }
}
