<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * The shape of a declared PHP type: one name (nullable or not), a union of types, or an intersection of classes.
 */
enum TypeShape: string
{
    case Named = 'named';
    case Union = 'union';
    case Intersection = 'intersection';
}
