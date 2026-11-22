<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The colour a state label is drawn in, from the shared theme.
 */
enum Tone: string
{
    case Neutral = 'neutral';
    case Good = 'good';
    case Warn = 'warn';
    case Danger = 'danger';
    case Note = 'note';
    case Muted = 'muted';
}
