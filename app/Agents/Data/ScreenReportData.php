<?php

declare(strict_types=1);

namespace App\Agents\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A host's frame of a watched runtime's screen.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ScreenReportData extends Data
{
    public function __construct(
        public readonly string $runtimeId,
        public readonly ScreenFrameData $frame,
    ) {}
}
