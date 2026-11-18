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
}
