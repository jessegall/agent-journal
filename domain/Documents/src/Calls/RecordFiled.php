<?php

declare(strict_types=1);

namespace Domain\Documents\Calls;

use Spatie\LaravelData\Data;

/**
 * A document or report just filed: its id, number and label.
 */
final class RecordFiled extends Data
{
    public function __construct(
        public string $id,
        public string $number,
        public string $label,
    ) {}
}
