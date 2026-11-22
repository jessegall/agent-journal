<?php

declare(strict_types=1);

namespace App\Enums;

/**
 * Where a simple command's word went: not read yet, an argument, an assignment node, or the start of an array
 * assignment that makes the command unsupported.
 */
enum WordPlace: string
{
    case Unread = 'unread';
    case Argument = 'argument';
    case Assignment = 'assignment';
    case ArrayAssignment = 'array_assignment';
}
