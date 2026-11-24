<?php

declare(strict_types=1);

namespace App\Data\Skills;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * One numbered revision of a stored skill as a reader shows it.
 */
final class SkillRevisionView extends Data
{
    /**
     * @param  array<string, mixed>  $condition
     * @param  list<SkillSectionView>  $sections
     */
    public function __construct(
        public readonly int $revision,
        public readonly string $name,
        public readonly string $description,
        public readonly array $condition,
        #[DataCollectionOf(SkillSectionView::class)]
        public readonly array $sections,
    ) {}
}
