<?php

declare(strict_types=1);

namespace App\Bus\Support;

/**
 * The listeners the command's transaction runs, by event, each a Class@method name or an invokable that gates it by
 * its domain's availability, in the order of their full names; built once at boot from the same map as the
 * dispatcher's, and never handed to the dispatcher.
 */
final readonly class RequiredListenerRegistry
{
    /**
     * @param  array<string, list<string|callable(object): mixed>>  $listeners
     */
    public function __construct(private array $listeners = []) {}

    /**
     * The required listeners of the event, in their order; none for an event no listener requires.
     *
     * @return list<string|callable(object): mixed>
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
