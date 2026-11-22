<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use Spatie\LaravelData\Data;

/**
 * One message a read or take touched: whether this read was its first and whether it took it up.
 */
final class MessageRead extends Data
{
    public function __construct(
        public string $messageId,
        public bool $firstRead,
        public bool $takenUp,
    ) {}
}
