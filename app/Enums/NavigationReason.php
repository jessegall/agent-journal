<?php

declare(strict_types=1);

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why a key script run could not be certain of its next key and asked the main agent for its way, or why a menu
 * library entry's replay failed a check on a build (doc 54, section 4, decision 3); the Go host's UncertaintyReason.
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
    case NextFingerprint = 'next-fingerprint';
}
