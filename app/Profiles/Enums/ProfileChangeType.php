<?php

declare(strict_types=1);

namespace App\Profiles\Enums;

/**
 * What an activation did to one profile compared with its active revision: added it, changed it, or appended the same
 * configuration again.
 */
enum ProfileChangeType: string
{
    case Added = 'added';
    case Changed = 'changed';
    case Unchanged = 'unchanged';
}
