<?php

declare(strict_types=1);

namespace App\Support\States\Support;

use App\Enums\Engine\NoSubject;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;

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
