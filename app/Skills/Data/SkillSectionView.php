<?php

declare(strict_types=1);

namespace App\Skills\Data;

use Spatie\LaravelData\Data;

/**
 * One section of a stored skill revision as a reader shows it: its key, heading and stored markdown.
 */
final class SkillSectionView extends Data
{
    public function __construct(
        public readonly string $key,
        public readonly string $heading,
        public readonly string $markdown,
    ) {}
}
