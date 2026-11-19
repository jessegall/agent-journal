<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Enums\NavigationCompletion;
use App\Agents\Models\MenuEntry;
use App\Agents\Models\NavigationRequest;
use App\Agents\Values\MenuStep;

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
        $entry = $this->samePath($navigation, $steps);
        if ($entry === null) {
            $completes = $navigation->completes ?? NavigationCompletion::Goal;
            $proof = (string) $navigation->proof;
            $entry = MenuEntry::proven($navigation->owner(), $navigation, $steps, $completes, $proof);
        } else {
            $entry->provenOn($navigation->build);
        }
        if ($navigation->stale_entry_id !== null && $navigation->stale_entry_id !== $entry->id) {
            MenuEntry::query()->acrossActors()->whereKey($navigation->stale_entry_id)->lockForUpdate()->first()
                ?->supersededBy($entry);
        }
        $navigation->savedAs($entry);

        return $entry;
    }

    /**
     * The owner's current entry with the same first screen, goal and steps, when there is one.
     *
     * @param  non-empty-list<MenuStep>  $steps
     */
    private function samePath(NavigationRequest $navigation, array $steps): MenuEntry|null
    {
        $stored = array_map(fn (MenuStep $step) => $step->toStored(), $steps);

        return MenuEntry::query()
            ->ownedBy($navigation->owner())
            ->current()
            ->forProgram($navigation->program)
            ->matching($steps[0]->fingerprint, $navigation->goal())
            ->lockForUpdate()
            ->readLimit(20)
            ->get()
            ->first(fn (MenuEntry $entry) => $entry->steps === $stored);
    }
}
