<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Enums\Terminals\TerminalInputType;
use App\Enums\Terminals\TerminalNamedKey;
use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a browser writer's input request tells the terminal's driver: the grant and sequence it came through, the
 * screen revision the writer saw, and the input itself, text, a paste, a named key or a new size.
 */
#[MapName(SnakeCaseMapper::class)]
final class TerminalInputMessageData extends Data
{
    public function __construct(
        public readonly string $grantId,
        public readonly int $sequence,
        public readonly int $screenRevision,
        public readonly string $text,
        #[MapInputName('enter')]
        public readonly bool $shouldEnter,
        public readonly TerminalInputType $type,
        public readonly TerminalNamedKey|null $key,
        public readonly int $rows,
        public readonly int $columns,
    ) {}
}
