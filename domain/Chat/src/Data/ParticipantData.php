<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One current member of a chat as the window lists it: who, under what name, through which driver for an agent, and
 * whether it owns the chat.
 */
#[TypeScript]
final class ParticipantData extends Data
{
    public function __construct(
        public readonly string $actor,
        public readonly string $label,
        public readonly string|null $driver,
    ) {}
}
