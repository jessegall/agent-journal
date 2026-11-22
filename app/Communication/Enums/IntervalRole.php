<?php

declare(strict_types=1);

namespace App\Communication\Enums;

/**
 * What a member's interval lets it do in a chat inbox: an owner runs the roster, a member takes part.
 */
enum IntervalRole: string
{
    case Owner = 'owner';
    case Member = 'member';

    public function isOwner(): bool
    {
        return $this === self::Owner;
    }
}
