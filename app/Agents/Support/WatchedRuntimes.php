<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\TerminalView;
use Illuminate\Contracts\Cache\Repository;

/**
 * The runtimes of a host that somebody watches, and a per-host counter raised whenever that set may have changed, so
 * a waiting claim can tell cheaply that it must answer.
 */
final readonly class WatchedRuntimes
{
    public function __construct(private Repository $cache) {}

    /**
     * Every runtime of the host with a view not ended, once, at the shortest interval its views ask for; a lapsed view
     * counts until the engine ends it.
     *
     * @return list<WatchedRuntime>
     */
    public function forHost(string $hostId): array
    {
        return TerminalView::query()
            ->acrossActors()
            ->watchedOnHost($hostId)
            ->get()
            ->map(fn (TerminalView $view): WatchedRuntime => new WatchedRuntime(
                $view->agent_runtime_id,
                $view->interval_ms,
            ))
            ->all();
    }

    public function version(string $hostId): int
    {
        return (int) $this->cache->get($this->key($hostId), 0);
    }

    /**
     * The host's watched set may have changed: its version goes up by one.
     */
    public function changed(string $hostId): void
    {
        $this->cache->add($this->key($hostId), 0);
        $this->cache->increment($this->key($hostId));
    }

    private function key(string $hostId): string
    {
        return "host-watched-version:{$hostId}";
    }
}
