<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Where a reader revision stands: a draft an agent proposed, which never unlocks a run (story 181), or a revision the
 * journal proved against real runs.
 */
enum ReaderState: string
{
    case Draft = 'draft';
    case Proven = 'proven';
}
