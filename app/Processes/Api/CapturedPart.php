<?php

declare(strict_types=1);

namespace App\Processes\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * One part of a restored run and whether its output is whole again.
 */
final class CapturedPart extends Data
{
    public function __construct(
        #[MapName('part_id')]
        public string $partId,
        public string $state,
    ) {}
}
