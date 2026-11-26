<?php

declare(strict_types=1);

namespace App\Stacks\Declarations;

use App\Contracts\Events\Event;

/**
 * The checked subscriptions of all installed states.
 */
final readonly class StateEvents
{
    /**
     * @var array<class-string<Event>, array<class-string, StateEventDeclaration>>
     */
    private array $byEvent;

    /**
     * @param  list<StateEventDeclaration>  $declarations
     */
    public function __construct(array $declarations)
    {
        $byEvent = [];

        foreach ($declarations as $declaration) {
            $byEvent[$declaration->event][$declaration->method->stateClass] = $declaration;
        }

        $this->byEvent = $byEvent;
    }

    public function contains(Event $event, StateMethod $method): bool
    {
        $declaration = $this->byEvent[$event::class][$method->stateClass] ?? null;

        return $declaration !== null && $declaration->method == $method;
    }

    /**
     * @return list<class-string<Event>>
     */
    public function eventClasses(): array
    {
        return array_keys($this->byEvent);
    }

    /**
     * @return list<string>
     */
    public function cacheEntries(): array
    {
        $eventCacheEntries = [];

        foreach ($this->byEvent as $declarations) {
            foreach ($declarations as $declaration) {
                $eventCacheEntries[] = $declaration->cacheEntry();
            }
        }

        sort($eventCacheEntries);

        return $eventCacheEntries;
    }
}
