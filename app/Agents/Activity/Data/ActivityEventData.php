<?php

declare(strict_types=1);

namespace App\Agents\Activity\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One line of the Activity window: when it happened (shown in the viewer's own zone), its level, the kit icon of its
 * type, the agent that did it, what it did, and what it found.
 */
#[TypeScript]
final class ActivityEventData extends Data
{
    /**
     * @param  list<string>  $found
     */
    public function __construct(
        public readonly string $id,
        public readonly string $occurredAt,
        public readonly int $level,
        public readonly string $icon,
        public readonly string $who,
        public readonly string $text,
        public readonly array $found,
    ) {}
}
