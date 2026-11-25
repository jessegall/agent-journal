<?php

declare(strict_types=1);

namespace App\Enums\Agents;

/**
 * What a dispatched child of a connected parent may do in its checkout.
 */
enum ChildRole: string
{
    case Writer = 'writer';
    case Reader = 'reader';
    case Helper = 'helper';
}
