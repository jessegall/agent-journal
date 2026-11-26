<?php

declare(strict_types=1);

namespace App\Projects\Enums;

/**
 * Why a host could not answer a read of its project, from the short list a host may name.
 */
enum ProjectReadFailure: string
{
    case Missing = 'missing';
    case NotADirectory = 'not_a_directory';
    case NotAFile = 'not_a_file';
    case Binary = 'binary';
    case TooLarge = 'too_large';
    case Unreadable = 'unreadable';
    case Outside = 'outside';
}
