<?php

declare(strict_types=1);

namespace App\Enums\Drivers;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * How a driver family's mark is drawn: as an image in its own colours, such as the Claude spark, or as a mask in the
 * text colour, such as the OpenAI knot, so it follows light and dark.
 */
#[TypeScript]
enum MarkTone: string
{
    case Own = 'own';
    case CurrentColor = 'current-color';
}
