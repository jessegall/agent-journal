<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Tasks\States;

use App\Enums\Engine\NoSubject;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;

/**
 * The stack reference of an ordinary task watch.
 */
final class OrdinaryTaskWatchStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'tasks.ordinary_task_watch';
    }

    public static function withoutSubject(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
