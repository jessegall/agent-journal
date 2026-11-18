<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareGrants;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareSummary;

final readonly class ApproveShareRequestHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private ShareGrants $grants) {}

    public function handle(ApproveShareRequest $command): ShareSummary
    {
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants->approve($this->actors->actor(), $command->shareId, $command->previewId, $command->previewChecksum, $duration)->summary();
    }
}
