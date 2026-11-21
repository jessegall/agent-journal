<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Enums\ReceiptState;
use App\Bus\Models\CommandReceipt;
use Carbon\CarbonImmutable;

/**
 * Expires the command receipts past their retention: each keeps its key as a tombstone and forgets its result.
 */
final readonly class ExpiredReceipts
{
    public function expirePastRetention(CarbonImmutable $now): int
    {
        return CommandReceipt::query()->pastRetention($now)->update([
            'state' => ReceiptState::Expired->value,
            'result' => null,
            'refusal_code' => null,
            'refusal_message' => null,
        ]);
    }
}
