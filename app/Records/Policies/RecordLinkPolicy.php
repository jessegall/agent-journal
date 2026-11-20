<?php

declare(strict_types=1);

namespace App\Records\Policies;

use App\Actors\Contracts\Policy;
use App\Links\Models\Link;

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
