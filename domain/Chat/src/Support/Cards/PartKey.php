<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\DockCardInvalid;

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
