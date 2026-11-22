<?php

declare(strict_types=1);

namespace Domain\Documents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Whether a document is free to edit, in a draft of the viewer's own, or held by someone else.
 */
#[TypeScript]
enum EditingState: string
{
    case Free = 'free';
    case Yours = 'yours';
    case Held = 'held';

    /**
     * The word the Editing fact shows: free, held by you, or held by the one who holds it.
     */
    public function word(string $holder): string
    {
        return match ($this) {
            self::Free => 'free',
            self::Yours => 'held by you',
            self::Held => "held by {$holder}",
        };
    }
}
