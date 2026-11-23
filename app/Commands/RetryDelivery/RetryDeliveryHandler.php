<?php

declare(strict_types=1);

namespace App\Commands\RetryDelivery;

use App\Contracts\Bus\CommandHandler;
use App\Models\OutstandingRange;
use App\Models\ReceiptDelivery;
use Carbon\CarbonImmutable;

final readonly class RetryDeliveryHandler implements CommandHandler
{
    public function handle(RetryDeliveryCommand $command): void
    {
        $range = OutstandingRange::lockedById($command->outstandingRangeId);
        $range->reopen();

        ReceiptDelivery::query()
            ->where('receipt_id', $range->receipt_id)
            ->lockForUpdate()
            ->first()
            ?->reopen(CarbonImmutable::now());
    }
}
