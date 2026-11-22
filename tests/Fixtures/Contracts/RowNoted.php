<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\Events\Event;

/**
 * The fact a RaisingRow raises when a transaction listener notes it.
 */
final readonly class RowNoted implements Event
{
    public function __construct(public int $rowId) {}
}
