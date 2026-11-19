<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why a key script run could not be certain and asked the main agent for its way (doc 54, section 4, decision 3).
 */
#[TypeScript]
enum NavigationReason: string
{
    case NoEntry = 'no-entry';
    case LabelMissing = 'label-missing';
    case Ambiguous = 'ambiguous';
    case HighlightWrong = 'highlight-wrong';
    case NoProof = 'no-proof';
    case StaleEntry = 'stale-entry';
}
