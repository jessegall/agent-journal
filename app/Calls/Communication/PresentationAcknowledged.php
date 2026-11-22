<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * How many pieces of a presentation batch an acknowledgement confirmed.
 */
#[MapName(SnakeCaseMapper::class)]
final class PresentationAcknowledged extends Data
{
    public function __construct(
        public readonly string $batchId,
        public readonly int $confirmed,
    ) {}
}
