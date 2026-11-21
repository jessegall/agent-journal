<?php

declare(strict_types=1);

namespace App\Ui\Enums;

/**
 * The HTTP method of an action a domain declares.
 */
enum ActionMethod: string
{
    case Get = 'GET';
    case Post = 'POST';
    case Patch = 'PATCH';
    case Delete = 'DELETE';
}
