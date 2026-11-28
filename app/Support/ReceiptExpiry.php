<?php

declare(strict_types=1);

namespace App\Support;

use App\CommandRules\Enums\ReceiptStatus;
use App\Models\CommandRules\CommandReceipt;
use Carbon\CarbonImmutable;

/**
 * Expires the command receipts past their retention: each keeps its key, refused for good, and forgets its result.
 */
final readonly class ReceiptExpiry
{
    public function expirePastRetention(CarbonImmutable $now): int
    {
        return CommandReceipt::query()->pastRetention($now)->update([
            'status' => ReceiptStatus::Expired->value,
            'result' => null,
            'refusal_code' => null,
            'refusal_message' => null,
        ]);
    }
}
