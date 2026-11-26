<?php

declare(strict_types=1);

namespace App\Data\Messages;

use App\Enums\Terminals\TerminalDraftChoice;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a browser writer's choice for the unsent line tells the terminal's driver: the grant and sequence it came
 * through, and the choice.
 */
#[MapName(SnakeCaseMapper::class)]
final class DraftChoiceMessageData extends Data
{
    public function __construct(
        public readonly string $grantId,
        public readonly int $sequence,
        public readonly TerminalDraftChoice $choice,
    ) {}
}
