<?php

declare(strict_types=1);

namespace App\Processes\Enums;

/**
 * Who owns a command rule: Core's built-ins, an installed module, or the project's own reviewed declarations.
 */
enum ScopeType: string
{
    case Core = 'core';
    case Module = 'module';
    case Project = 'project';

    /**
     * Whether rules of this owner hold from the start; a module's rules wait for review.
     */
    public function isActiveUnreviewed(): bool
    {
        return $this !== self::Module;
    }
}
