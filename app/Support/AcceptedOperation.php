<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The bus operation that admitted a write: the receipt it was accepted under, which a message keeps as its origin.
 */
final readonly class AcceptedOperation
{
    public function __construct(public string $receiptId) {}
}
