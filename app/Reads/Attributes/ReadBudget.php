<?php

declare(strict_types=1);

namespace App\Reads\Attributes;

use Attribute;

/**
 * The most queries and models a reader method may use, at the largest page or batch it allows.
 */
#[Attribute(Attribute::TARGET_METHOD)]
final readonly class ReadBudget
{
    public function __construct(
        public int $queries,
        public int $models,
        public string $formula = '',
    ) {}
}
