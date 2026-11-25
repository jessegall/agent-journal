<?php

declare(strict_types=1);

namespace App\Models\Support;

/**
 * For a model whose rows belong to one project or to Global: a query sees the selection's rows and the Global ones.
 */
trait BelongsToProjectOrGlobal
{
    use BelongsToProject;

    protected static function showsGlobalRows(): bool
    {
        return true;
    }
}
