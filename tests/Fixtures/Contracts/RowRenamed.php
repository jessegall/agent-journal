<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\Events\Event;

/**
 * The fact a RaisingRow raises when it is renamed.
 */
final readonly class RowRenamed implements Event
{
    public function __construct(public int $rowId, public string $name) {}
}
