<?php

declare(strict_types=1);

namespace App\Web\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Where a window sits in a work layout, so a layout picks its windows by place and never by a domain's key.
 */
#[TypeScript]
enum WindowPlace: string
{
    // A tree of what the work is made of, at the side.
    case Tree = 'tree';

    // The one thing being worked on, in the middle.
    case Editor = 'editor';

    // What is happening, as it happens, beside or below the editor.
    case Feed = 'feed';
}
