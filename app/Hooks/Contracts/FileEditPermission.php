<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

/**
 * Whether the acting agent's declaration lets it change workspace files.
 */
interface FileEditPermission
{
    public function mayEditFiles(): bool;
}
