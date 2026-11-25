<?php

declare(strict_types=1);

namespace App\Enums\Skills;

/**
 * The three answers of a skill condition. Only Match makes a skill eligible; Unavailable never turns into a match.
 */
enum ConditionOutcome: string
{
    case Match = 'match';
    case NoMatch = 'no_match';
    case Unavailable = 'unavailable';
}
