<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Web\ProtectedViews as ProtectedViewsContract;
use App\Events\Web\ProtectedViewInvalidated;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Tells users' open pages to read again through their own view channels.
 */
final readonly class ProtectedViews implements ProtectedViewsContract
{
    public function __construct(private Dispatcher $events) {}

    public function invalidateFor(array $userIds): void
    {
        $this->events->dispatch(new ProtectedViewInvalidated($userIds));
    }
}
