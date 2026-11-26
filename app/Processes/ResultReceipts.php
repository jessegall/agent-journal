<?php

declare(strict_types=1);

namespace App\Processes;

use App\Bus\Contracts\ResultReceipts as ResultReceiptsContract;
use App\Models\Runs\ResultReceipt;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The selected project's current result receipts, read through named scopes.
 */
final readonly class ResultReceipts implements ResultReceiptsContract
{
    public function find(string $receiptId): Option
    {
        $receipt = ResultReceipt::query()
            ->current()
            ->whereKey($receiptId)
            ->first();

        if ($receipt === null) {
            return None::create();
        }

        return Some::create($receipt->published());
    }

    public function forPart(string $runId): Option
    {
        $receipt = ResultReceipt::query()
            ->current()
            ->ofPartRun($runId)
            ->first();

        if ($receipt === null) {
            return None::create();
        }

        return Some::create($receipt->published());
    }
}
