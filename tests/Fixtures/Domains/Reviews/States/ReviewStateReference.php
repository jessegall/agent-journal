<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\States;

use App\Enums\Engine\NoSubject;
use App\Support\Decisions\StateReferenceFactory;
use App\Support\References\StateReference;

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
