<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Inputs;

enum FileOperation: string
{
    case Create = 'create';
    case Edit = 'edit';
    case Delete = 'delete';
}
