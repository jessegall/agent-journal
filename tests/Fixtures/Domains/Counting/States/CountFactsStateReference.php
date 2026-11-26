<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Counting\States;

use App\Enums\Engine\NoSubject;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;

/**
 * The stack reference of counting facts.
 */
final class CountFactsStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'counting.count_facts';
    }

    public static function withoutSubject(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
