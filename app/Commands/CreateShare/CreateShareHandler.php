<?php

declare(strict_types=1);

namespace App\Commands\CreateShare;

use App\Contracts\Bus\CommandHandler;
use App\Support\ShareDuration;
use App\Support\ShareGrants;
use App\Support\ShareSummary;

final readonly class CreateShareHandler implements CommandHandler
{
    public function __construct(
        private ShareGrants $grants,
    ) {}

    public function handle(CreateShareCommand $command): ShareSummary
    {
        $duration = ShareDuration::of($command->minutesUntilExpiry);

        return $this->grants
            ->create($command->dispatchedBy(), $command->previewId, $command->previewChecksum, $duration)
            ->summary();
    }
}
