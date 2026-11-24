<?php

declare(strict_types=1);

namespace App\Commands\Sharing\ApproveShareRequest;

use App\Contracts\Bus\CommandHandler;
use App\Support\ShareDuration;
use App\Support\ShareGrants;
use App\Support\ShareSummary;

final readonly class ApproveShareRequestHandler implements CommandHandler
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
