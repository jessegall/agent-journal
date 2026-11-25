<?php

declare(strict_types=1);

namespace App\Enums\Agents;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How much an activity entry matters: a detail only the full feed shows, an entry of the Activity panel, or one worth
 * a line in the agent's conversation.
 */
#[TypeScript]
enum ActivityLevel: int
{
    case Detail = 1;
    case Panel = 2;
    case Notable = 3;

    public function label(): string
    {
        return match ($this) {
            self::Detail => 'Detail',
            self::Panel => 'In the panel',
            self::Notable => 'Notable',
        };
    }
}
