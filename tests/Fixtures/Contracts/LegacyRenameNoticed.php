<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\Event;

/**
 * A legacy send of a handler, which has no row to raise on and goes through the stream.
 */
final readonly class LegacyRenameNoticed implements Event
{
    public function __construct(public string $label) {}
}
