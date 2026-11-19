<?php

declare(strict_types=1);

namespace App\Agents\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * Why the replay of a menu library entry failed a check on a build, so the entry is stale there.
 */
#[TypeScript]
enum MenuStaleReason: string
{
    case NextFingerprint = 'next-fingerprint';
    case LabelMissing = 'label-missing';
    case Ambiguous = 'ambiguous';
    case HighlightWrong = 'highlight-wrong';
    case NoProof = 'no-proof';
}
