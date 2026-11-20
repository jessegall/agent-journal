<?php

declare(strict_types=1);

namespace App\Hooks\Events\Support;

/**
 * A dispatch carried privately through the framework's deferred arguments.
 */
final readonly class StateEventPayload
{
    public function __construct(private object $key, public StateEventDispatch $dispatch) {}

    public function hasKey(object $key): bool
    {
        return $this->key === $key;
    }
}
