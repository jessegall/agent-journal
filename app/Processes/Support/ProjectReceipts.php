<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Contracts\ResultReceipts;
use App\Processes\Models\ResultReceipt;
use App\Processes\Values\PublishedResult;
use PhpOption\Option;

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

        return Option::fromValue($receipt)->map(fn (ResultReceipt $current): PublishedResult => $current->published());
    }

    public function forPart(string $partRunId): Option
    {
        $receipt = ResultReceipt::query()
            ->ofProject($this->projects->current())
            ->current()
            ->where('part_run_id', $partRunId)
            ->first();

        return Option::fromValue($receipt)->map(fn (ResultReceipt $current): PublishedResult => $current->published());
    }
}
