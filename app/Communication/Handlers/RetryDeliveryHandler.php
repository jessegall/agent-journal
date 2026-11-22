<?php

declare(strict_types=1);

namespace App\Communication\Handlers;

use App\Communication\Commands\RetryDelivery;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\ReceiptDelivery;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class RetryDeliveryHandler implements CommandHandler
{
    public function handle(RetryDelivery $command): void
    {
        $range = OutstandingRange::query()->whereKey($command->outstandingRangeId)->lockForUpdate()->firstOrFail();
        $range->reopen();

        ReceiptDelivery::query()
            ->where('receipt_id', $range->receipt_id)
            ->lockForUpdate()
            ->first()
            ?->reopen(CarbonImmutable::now());
    }
}
