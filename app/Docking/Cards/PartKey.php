<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Enums\PartType;
use App\Docking\Exceptions\DockCardInvalid;

/**
 * The check every part makes of its key: present, since siblings are told apart by it.
 */
final class PartKey
{
    public static function assertGiven(string $key, PartType $type): void
    {
        if (trim($key) === '') {
            throw DockCardInvalid::blankKey($type->value);
        }
    }
}
