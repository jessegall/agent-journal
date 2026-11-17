<?php

declare(strict_types=1);

namespace Tests\Fixtures\Boundary\EventCalls\Plans\Listeners;

use App\Core\Hooks\Events\StateTypesRequested;
use Illuminate\Support\Facades\Event;

final class RaisesCoreRequest
{
    public function handle(StateTypesRequested $event): void
    {
        Event::dispatch(StateTypesRequested::class, [$event]);
    }
}
