<?php

declare(strict_types=1);

namespace Domain\Documents\Api;

use Spatie\LaravelData\Data;

/**
 * A document or report just filed: its id, number and label.
 */
final class RecordFiled extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $label,
        public readonly int $revision = 1,
    ) {}
}
