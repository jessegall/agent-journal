<?php

declare(strict_types=1);

namespace Tests\Fixtures\Contracts;

use App\Contracts\Events\Event;

/**
 * A handler's send, which has no row to raise on and goes through the stream.
 */
final readonly class StreamedRenameNoticed implements Event
{
    public function __construct(public string $label) {}
}
