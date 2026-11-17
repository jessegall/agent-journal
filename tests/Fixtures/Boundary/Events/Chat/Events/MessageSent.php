<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Chat\Events;

use Illuminate\Foundation\Events\Dispatchable;

final class MessageSent
{
    use Dispatchable;

    public function __construct(public readonly int $messageId) {}
}
