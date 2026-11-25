<?php

declare(strict_types=1);

namespace App\Enums\Profiles;

/**
 * The form of a host operand: a file path, a network destination, or a journal record a scoped grant names.
 */
enum ResourceType: string
{
    case Path = 'path';
    case Destination = 'destination';
    case Record = 'record';
}
