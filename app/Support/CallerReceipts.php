<?php

declare(strict_types=1);

namespace App\Support;

use App\Bus\Contracts\CallerReceipts as CallerReceiptsContract;
use App\Bus\Values\ReceiptAnswer;
use App\CommandRules\ReceiptCallers;
use App\Models\CommandRules\CommandReceipt;

/**
 * The current caller's receipts from the command receipts table, read as the bus receipts the command.
 */
final readonly class CallerReceipts implements CallerReceiptsContract
{
    public function __construct(private ReceiptCallers $callers) {}

    public function answerFor(string $command, string $requestKey, string $target): array
    {
        $caller = $this->callers->forCommand($command, $this->callers->current()->actor);
        $receipt = CommandReceipt::findReadFor($caller, $command, $requestKey);

        if ($receipt === null || ! $receipt->isForTarget($target)) {
            return [];
        }

        $answered = $receipt->result->value ?? '';

        return [new ReceiptAnswer(
            $receipt->status,
            is_array($answered) ? '' : (string) $answered,
            is_array($answered) ? $answered : [],
            (string) $receipt->refusal_code,
            (string) $receipt->refusal_message,
            $receipt->isExpired(),
        )];
    }
}
