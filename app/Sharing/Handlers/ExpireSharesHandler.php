<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareEndings;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Models\Share;
use App\Sharing\Support\ShareExpiry;

final readonly class ExpireSharesHandler implements CommandHandler
{
    private const int MOST_PER_RUN = 100;

    public function __construct(private ShareEndings $endings) {}

    public function handle(ExpireShares $command): ShareExpiry
    {
        $due = Share::lockPastDeadline(self::MOST_PER_RUN + 1);
        $batch = array_slice($due, 0, self::MOST_PER_RUN);

        foreach ($batch as $share) {
            $this->endings->expire($share);
        }

        return new ShareExpiry(count($batch), count($due) > self::MOST_PER_RUN);
    }
}
