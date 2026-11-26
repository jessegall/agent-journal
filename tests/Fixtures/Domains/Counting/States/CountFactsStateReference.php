<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Counting\States;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;

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
