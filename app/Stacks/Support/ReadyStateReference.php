<?php

declare(strict_types=1);

namespace App\Stacks\Support;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;

/**
 * The stack reference of the permanent bottom of every stack.
 */
final class ReadyStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'core.ready';
    }

    public static function bottom(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
