<?php

declare(strict_types=1);

namespace App\Calls\Communication;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The claim on a turn to speak: the token a write presents while the claim lasts, on the user message it is for.
 */
#[MapName(SnakeCaseMapper::class)]
final class SpeechClaim extends Data
{
    public function __construct(
        public readonly string $rootId,
        public readonly string $claimToken,
    ) {}
}
