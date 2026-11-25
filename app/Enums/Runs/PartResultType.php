<?php

declare(strict_types=1);

namespace App\Enums\Runs;

/**
 * How a part's result stands: the receipt gate answered it, the run only gathered evidence, or no result can be given.
 */
enum PartResultType: string
{
    case Receipted = 'receipted';
    case EvidenceOnly = 'evidence_only';
    case Unavailable = 'unavailable';
}
