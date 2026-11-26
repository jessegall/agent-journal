<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ApproveShareRequest;

use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareGrants;
use App\Sharing\Support\ShareSummary;

final readonly class ApproveShareRequestHandler extends SharingCommandHandler
{
    public function __construct(
        private ShareGrants $grants,
    ) {}

    public function handle(ApproveShareRequestCommand $command): ShareSummary
    {
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants->approve(
            $command->dispatchedBy(),
            $command->shareId,
            $command->previewId,
            $command->previewChecksum,
            $duration,
        )->summary;
    }
}
