<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\OwnerPolicy;
use App\Models\Records\Layout;

/**
 * Who may save, change and delete a user's own layouts.
 */
final readonly class LayoutPolicy implements OwnerPolicy
{
    public static function model(): string
    {
        return Layout::class;
    }
}
