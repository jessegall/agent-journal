<?php

declare(strict_types=1);

namespace App\Bus\Values;

use App\CommandRules\Enums\ReceiptStatus;

/**
 * What the caller's receipt of one command under one request key says: its state, the result a completed command
 * answered (a scalar as text, an object as its plain fields), the code and message a refused one gave, and whether it
 * no longer answers.
 */
final readonly class ReceiptAnswer
{
    /**
     * @param  array<string, mixed>  $fields
     */
    public function __construct(
        public ReceiptStatus $status,
        public string $result,
        public array $fields,
        public string $refusalCode,
        public string $refusalMessage,
        public bool $isExpired,
    ) {}
}
