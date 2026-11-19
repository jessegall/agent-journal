<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Models\TerminalView;

/**
 * The runtimes of a host that somebody watches, and the version of that list: a hash of the list itself, so every
 * change of a view, a runtime's host or the engine's sweep changes it without any writer having to say so.
 */
final readonly class WatchedRuntimes
{
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

    /**
     * Whether the runtime of the host has a view not ended.
     */
    public function isWatched(string $hostId, string $runtimeId): bool
    {
        return TerminalView::query()
            ->acrossActors()
            ->watchedOnHost($hostId)
            ->where('agent_runtime_id', $runtimeId)
            ->exists();
    }

    /**
     * The version of the host's watched list: 0 while nobody watches, otherwise a hash of the sorted list.
     */
    public function version(string $hostId): int
    {
        return self::versionOf($this->forHost($hostId));
    }

    /**
     * @param  list<WatchedRuntime>  $watched
     */
    public static function versionOf(array $watched): int
    {
        if ($watched === []) {
            return 0;
        }

        $entries = array_map(
            fn (WatchedRuntime $runtime): string => "{$runtime->runtimeId}:{$runtime->intervalMs}",
            $watched,
        );

        return crc32(implode(',', $entries));
    }
}
