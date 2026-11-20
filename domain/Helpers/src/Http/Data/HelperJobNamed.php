<?php

declare(strict_types=1);

namespace Domain\Helpers\Http\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The helper job a write changed.
 */
#[MapName(SnakeCaseMapper::class)]
final class HelperJobNamed extends Data
{
    public function __construct(public string $jobId) {}
}
