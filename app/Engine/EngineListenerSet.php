<?php

declare(strict_types=1);

namespace App\Engine;

use App\Contracts\Events\EngineListener;

/**
 * The listeners every engine pass delivers EngineTicked to, by class, in the order the areas added them.
 */
final class EngineListenerSet
{
    /**
     * @var list<class-string<EngineListener>>
     */
    private array $listeners = [];

    /**
     * @param  class-string<EngineListener>  $listener
     */
    public function add(string $listener): void
    {
        if ($this->has($listener)) {
            return;
        }

        $this->listeners[] = $listener;
    }

    /**
     * @param  class-string<EngineListener>  $listener
     */
    public function has(string $listener): bool
    {
        return in_array($listener, $this->listeners, true);
    }

    /**
     * @return list<class-string<EngineListener>>
     */
    public function all(): array
    {
        return $this->listeners;
    }
}
