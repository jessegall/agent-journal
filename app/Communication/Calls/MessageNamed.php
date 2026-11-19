<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use Spatie\LaravelData\Data;

/**
 * The message a write made or changed.
 */
final class MessageNamed extends Data
{
    public function __construct(
        public string $messageId,
    ) {}
}
