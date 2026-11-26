<?php

declare(strict_types=1);

namespace App\Messages\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a private input request tells the host: the grant it writes through, its place in the input sequence, and
 * the submission whose value the host fetches once.
 */
#[MapName(SnakeCaseMapper::class)]
final class PrivateInputMessageData extends Data
{
    public function __construct(
        public readonly string $grantId,
        public readonly int $sequence,
        public readonly string $submissionId,
    ) {}
}
