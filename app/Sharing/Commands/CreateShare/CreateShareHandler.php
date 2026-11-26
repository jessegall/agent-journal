<?php

declare(strict_types=1);

namespace App\Sharing\Commands\CreateShare;

use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareGrants;
use App\Sharing\Support\ShareSummary;

final readonly class CreateShareHandler extends SharingCommandHandler
{
    public function __construct(
        private ShareGrants $grants,
    ) {}

    public function handle(CreateShareCommand $command): ShareSummary
    {
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants
            ->create($command->dispatchedBy(), $command->previewId, $command->previewChecksum, $duration)
            ->summary;
    }
}
