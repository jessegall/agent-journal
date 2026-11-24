<?php

declare(strict_types=1);

namespace App\Data\Skills;

use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One revision of a stored skill as a history shows it: who saved it, when, and the skill it was copied from.
 */
#[MapOutputName(SnakeCaseMapper::class)]
final class SkillRevisionRow extends Data
{
    public function __construct(
        public readonly int $revision,
        public readonly string $name,
        public readonly string $author,
        public readonly string|null $copiedFrom,
        public readonly string $savedAt,
    ) {}
}
