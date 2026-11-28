<?php

declare(strict_types=1);

namespace App\Support;

use App\CommandRules\Enums\ReceiptStatus;
use App\Engine\Enums\RefusalCode;
use Carbon\CarbonImmutable;

/**
 * One receipted write of the caller as its operations read shows it: the command, where it stands, and its result as
 * plain values or its refusal.
 */
final readonly class ReceiptedWrite
{
    public function __construct(
        public string $requestKey,
        public string $command,
        public ReceiptStatus $status,
        public mixed $commandReply,
        public RefusalCode|null $refusalCode,
        public string|null $refusalMessage,
        public CarbonImmutable $createdAt,
    ) {}
}
