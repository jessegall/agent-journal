<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Bus\ResultReceipts;
use App\Models\Runs\ResultReceipt;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;

/**
 * The current project's current result receipts, read through named scopes.
 */
final readonly class ProjectReceipts implements ResultReceipts
{
    public function __construct(private ProjectKey $projects) {}

    public function find(string $receiptId): Option
    {
        $receipt = ResultReceipt::query()
            ->ofProject($this->projects->current())
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
            ->ofProject($this->projects->current())
            ->current()
            ->where('part_run_id', $runId)
            ->first();

        if ($receipt === null) {
            return None::create();
        }

        return Some::create($receipt->published());
    }
}
