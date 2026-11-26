<?php

declare(strict_types=1);

namespace App\Api\Communication;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The message a write made or changed.
 */
#[MapName(SnakeCaseMapper::class)]
final class MessageNamed extends Data
{
    public function __construct(
        public readonly string $messageId,
    ) {}
}
