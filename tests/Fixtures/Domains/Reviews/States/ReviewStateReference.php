<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\States;

use App\Engine\Enums\NoSubject;
use App\Stacks\Decisions\StateReferenceFactory;
use App\Stacks\References\StateReference;

/**
 * The stack reference of a review.
 */
final class ReviewStateReference extends StateReferenceFactory
{
    public static function key(): string
    {
        return 'reviews.reviewing';
    }

    public static function withoutSubject(): StateReference
    {
        return self::about(NoSubject::None);
    }
}
