<?php

declare(strict_types=1);

namespace App\Contracts\Navigation;

use App\Enums\Navigation\MenuEntryStatus;
use App\Support\ActorIdentity;

/**
 * Reads the menu library and the navigation requests for the main agent's tools, as plain arrays.
 */
interface NavigationReader
{
    public const int MENU_PAGE_SIZE = 50;

    public const int ROUND_LIMIT = 100;

    /**
     * One page of the owner's menu entries, newest first, keyed by entry id.
     *
     * @return array<string, array<string, mixed>>
     */
    public function menuEntries(
        ActorIdentity $owner,
        string|null $driver,
        MenuEntryStatus|null $state,
        int $page,
    ): array;

    /**
     * How many of the owner's menu entries match the filters, over every page.
     */
    public function menuEntryCount(ActorIdentity $owner, string|null $driver, MenuEntryStatus|null $state): int;

    /**
     * One menu entry of the owner, whole.
     *
     * @return array<string, mixed>
     */
    public function menuEntry(ActorIdentity $owner, string $id): array;

    /**
     * One navigation request the current actor may answer, with its screen and up to ROUND_LIMIT of its rounds
     * from the first one asked for, counted from 1, with the first round of the rest when more follow.
     *
     * @return array<string, mixed>
     */
    public function navigationRequest(string $id, int $firstRound): array;
}
