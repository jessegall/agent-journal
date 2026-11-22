<?php

declare(strict_types=1);

namespace Tests\Fixtures\Modules\Handbook\Policies;

use App\Contracts\Actors\Actor;
use App\Contracts\Authorization\VisibilityCheck;
use Tests\Fixtures\Modules\Handbook\Support\HandbookEntries;

/**
 * Whether the handbook may be read at all; a test closes it to see the page refused.
 */
final readonly class ReadHandbook implements VisibilityCheck
{
    public function __construct(private HandbookEntries $entries) {}

    public function allows(Actor $actor): bool
    {
        return $this->entries->isReadable;
    }
}
