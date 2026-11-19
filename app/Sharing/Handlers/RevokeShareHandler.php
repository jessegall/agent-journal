<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareEndings;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Models\Share;
use App\Sharing\Support\ShareSummary;

final readonly class RevokeShareHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareEndings $endings,
    ) {}

    public function handle(RevokeShare $command): ShareSummary
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $share = Share::lockForChange($command->shareId);
        $this->endings->revoke($share, ActorIdentity::of($owner));

        return $share->summary();
    }
}
