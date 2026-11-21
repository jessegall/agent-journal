<?php

declare(strict_types=1);

namespace App\Connections\Enums;

/**
 * What a dispatched child of a connected parent may do in its checkout.
 */
enum ChildRole: string
{
    case Writer = 'writer';
    case Reader = 'reader';
    case Helper = 'helper';
}
