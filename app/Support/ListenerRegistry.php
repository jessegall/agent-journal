<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Engine\ListenerLane;

/**
 * Every event listener, by event and by lane, each a Class@method name or an invokable that gates it by its domain's
 * availability, built once at boot. The after-commit lane is what Laravel's dispatcher registers; the command's
 * transaction runs the in-command-transaction lane, in the order of the listeners' full names.
 */
final readonly class ListenerRegistry
{
    /**
     * @param  array<string, list<string|AvailableListener>>  $inCommandTransaction
     * @param  array<string, list<string|AvailableListener|IsolatedListener>>  $afterCommit
     */
    public function __construct(private array $inCommandTransaction = [], private array $afterCommit = []) {}

    /**
     * The event's listeners of the lane, in their order; none when the lane holds none for it.
     *
     * @return list<string|callable(object): mixed>
     */
    public function listenersOf(string $event, ListenerLane $lane): array
    {
        return $this->byEvent($lane)[$event] ?? [];
    }

    /**
     * Every listener of the lane, by event.
     *
     * @return array<string, list<string|AvailableListener|IsolatedListener>>
     */
    public function byEvent(ListenerLane $lane): array
    {
        return match ($lane) {
            ListenerLane::InCommandTransaction => $this->inCommandTransaction,
            ListenerLane::AfterCommit => $this->afterCommit,
        };
    }
}
