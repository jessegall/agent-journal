<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Navigation\NavigationCompletion;
use App\Models\Drivers\MenuEntry;
use App\Models\Drivers\NavigationRequest;
use App\Values\MenuStep;

/**
 * Saves a proven navigation as its owner's menu entry: a new current entry, or the build added to the current entry
 * of the same path, superseding the stale entry the request replaced.
 */
final readonly class NavigationLibrary
{
    /**
     * @param  non-empty-list<MenuStep>  $steps
     */
    public function save(NavigationRequest $navigation, array $steps): MenuEntry
    {
        $entry = MenuEntry::findLockedForPath($navigation, $steps);

        if ($entry === null) {
            $completes = $navigation->completes ?? NavigationCompletion::Goal;
            $proof = (string) $navigation->proof;
            $entry = MenuEntry::create($navigation->actor(), $navigation, $steps, $completes, $proof);
        } else {
            $entry->provenOn($navigation->build);
        }

        if ($navigation->stale_entry_id !== null && $navigation->stale_entry_id !== $entry->id) {
            $staleEntry = MenuEntry::query()->acrossActors()->whereKey(
                $navigation->stale_entry_id,
            )->lockForUpdate()->first();
            $staleEntry?->supersededBy($entry);
        }

        $navigation->savedAs($entry);

        return $entry;
    }
}
