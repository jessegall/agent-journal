<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a run attempt's result came from: the supervisor's signed result, the journal's own decision such as a
 * deliberate stop, or provisional loss evidence that a signed result may still correct.
 */
enum RunResultSource: string
{
    case Signed = 'signed';
    case Journal = 'journal';
    case Provisional = 'provisional';

    public function isAuthoritative(): bool
    {
        return $this !== self::Provisional;
    }
}
