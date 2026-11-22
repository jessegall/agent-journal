<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What the main agent's proof completes: the whole goal of the key script, or only the step it stalled at, after
 * which the script goes on from its next step.
 */
#[TypeScript]
enum NavigationCompletion: string
{
    case Goal = 'goal';
    case Step = 'step';
}
