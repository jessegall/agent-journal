<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\Events\Chat\Events;

use App\Contracts\Event;
use Illuminate\Foundation\Events\Dispatchable;

final class MessageSent implements Event
{
    use Dispatchable;

    public function __construct(public readonly int $messageId) {}
}
