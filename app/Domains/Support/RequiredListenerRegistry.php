<?php

declare(strict_types=1);

namespace App\Domains\Support;

/**
 * The listeners the command's transaction runs, by event, each gated by its domain's availability and in the order of
 * their full names; built once at boot from the same map as the dispatcher's, and never handed to the dispatcher.
 */
final readonly class RequiredListenerRegistry
{
    /**
     * @param  array<string, list<string|AvailableListener>>  $listeners
     */
    public function __construct(private array $listeners = []) {}

    /**
     * The required listeners of the event, in their order; none for an event no listener requires.
     *
     * @return list<string|AvailableListener>
     */
    public function listenersOf(string $event): array
    {
        return $this->listeners[$event] ?? [];
    }

    /**
     * Every event a listener is required for.
     *
     * @return list<string>
     */
    public function events(): array
    {
        return array_keys($this->listeners);
    }
}
