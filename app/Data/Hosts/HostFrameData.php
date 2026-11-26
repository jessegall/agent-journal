<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One screen of a terminal process as the host's emulator saw it, timed on the host's own clock: when it was captured
 * and, per row, how long that row has not changed.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class HostFrameData extends Data
{
    /**
     * @param  list<string>  $rows
     * @param  list<int>  $unchangedMs
     */
    public function __construct(
        public readonly array $rows,
        public readonly int $cursorRow,
        public readonly int $cursorColumn,
        public readonly int $columns,
        public readonly int $captured,
        public readonly array $unchangedMs,
        public readonly string $buffer = 'normal',
        public readonly string|null $title = null,
        public readonly bool $isShielded = false,
    ) {}
}
