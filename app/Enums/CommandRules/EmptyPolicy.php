<?php

declare(strict_types=1);

namespace App\Enums\CommandRules;

/**
 * What an empty output means: invalid, or a success the tool states by emitting nothing.
 */
enum EmptyPolicy: string
{
    case Invalid = 'invalid';
    case AllowedSuccess = 'allowed_success';
}
