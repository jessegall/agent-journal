<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\Bus\Enums\ReceiptState;

/**
 * What the caller's receipt of one command under one request key says: its state, the value a completed command
 * answered, the code and message a refused one gave, and whether it no longer answers.
 */
final readonly class ReceiptAnswer
{
    public function __construct(
        public ReceiptState $state,
        public string $value,
        public string $refusalCode,
        public string $refusalMessage,
        public bool $isExpired,
    ) {}
}
