<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What Claude Code hands its status line: its limit windows by their name, such as five_hour; a window it leaves out
 * is not measured.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class StatusLineInputData extends Data
{
    /**
     * @param  array<string, StatusLineWindowData>  $rateLimits
     */
    public function __construct(
        #[DataCollectionOf(StatusLineWindowData::class)]
        public readonly array $rateLimits = [],
    ) {}
}
