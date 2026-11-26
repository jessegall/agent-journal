<?php

declare(strict_types=1);

namespace App\Policies;

use App\Access\Contracts\Policy;
use App\Models\Records\Link;

/**
 * Who may work with links between records: every granted actor, so the grants decide.
 */
final readonly class RecordLinkPolicy implements Policy
{
    public static function model(): string
    {
        return Link::class;
    }
}
