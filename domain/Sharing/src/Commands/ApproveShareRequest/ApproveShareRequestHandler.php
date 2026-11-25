<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ApproveShareRequest;

use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareGrants;
use Domain\Sharing\Support\ShareSummary;

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
