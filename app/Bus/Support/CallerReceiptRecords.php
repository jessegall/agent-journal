<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Contracts\CallerReceipts;
use App\Bus\Models\CommandReceipt;
use App\Bus\Values\ReceiptAnswer;

/**
 * The current caller's receipts from the command receipts table, read as the bus receipts the command.
 */
final readonly class CallerReceiptRecords implements CallerReceipts
{
    public function __construct(private ReceiptCallers $callers) {}

    public function answerFor(string $command, string $requestKey, string $target): array
    {
        $caller = $this->callers->forCommand($command, $this->callers->current()->actor);
        $receipt = CommandReceipt::readFor($caller, $command, $requestKey);

        if ($receipt === null || ! $receipt->isForTarget($target)) {
            return [];
        }

        return [new ReceiptAnswer(
            $receipt->state,
            (string) ($receipt->result['value'] ?? ''),
            (string) $receipt->refusal_code,
            (string) $receipt->refusal_message,
            $receipt->isExpired(),
        )];
    }
}
