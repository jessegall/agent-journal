<?php

declare(strict_types=1);

namespace App\Sharing\Commands\ExpireShares;

use App\Models\Sharing\Share;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Support\ShareEndings;
use App\Sharing\Support\ShareExpiry;

final readonly class ExpireSharesHandler extends SharingCommandHandler
{
    private const int MOST_PER_RUN = 100;

    public function __construct(private ShareEndings $endings) {}

    public function handle(ExpireSharesCommand $command): ShareExpiry
    {
        $due = Share::findLockedPastDeadline(self::MOST_PER_RUN + 1);
        $batch = array_slice($due, 0, self::MOST_PER_RUN);

        foreach ($batch as $share) {
            $this->endings->expire($share);
        }

        return new ShareExpiry(count($batch), count($due) > self::MOST_PER_RUN);
    }
}
