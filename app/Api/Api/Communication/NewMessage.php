<?php

declare(strict_types=1);

namespace App\Api\Api\Communication;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A message to send: the inbox it comes from, the inbox it goes to, and what it says.
 */
#[MapName(SnakeCaseMapper::class)]
final class NewMessage extends Data
{
    public function __construct(
        #[Size(26)]
        public readonly string $inboxId,
        public readonly string $body,
        public readonly int|null $targetMessageNumber = null,
    ) {}
}
