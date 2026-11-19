<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\MenuEntryState;

/**
 * Reads the menu library and the navigation requests for the main agent's tools, as plain arrays.
 */
interface NavigationReader
{
    /**
     * One page of the owner's menu entries, newest first.
     *
     * @return list<array<string, mixed>>
     */
    public function menuEntries(
        ActorIdentity $owner,
        string|null $program,
        MenuEntryState|null $state,
        int $page,
    ): array;

    /**
     * One menu entry of the owner, whole.
     *
     * @return array<string, mixed>
     */
    public function menuEntry(ActorIdentity $owner, string $id): array;

    /**
     * One navigation request the current actor may answer, with its rounds and its screen.
     *
     * @return array<string, mixed>
     */
    public function navigationRequest(string $id): array;
}
