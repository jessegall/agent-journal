<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * What a record of a check's output counts as: a result, a diagnostic, progress, noise the reader allows, or the
 * terminal summary.
 */
enum RecordRole: string
{
    case Outcome = 'outcome';
    case Diagnostic = 'diagnostic';
    case Progress = 'progress';
    case AllowedNoise = 'allowed_noise';
    case Summary = 'summary';
}
