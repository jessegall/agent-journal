<?php

declare(strict_types=1);

namespace App\Data\Hosts;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One process a host holds after its start: its container, whether it lives, whether its terminal is held, and how
 * far its pipe spool reached.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class InventoryProcessData extends Data
{
    public function __construct(
        public readonly string $processId,
        public readonly string $identity,
        public readonly bool $isAlive,
        public readonly string|null $container = null,
        public readonly bool $isTerminalHeld = false,
        public readonly int $spoolOffset = 0,
    ) {}
}
