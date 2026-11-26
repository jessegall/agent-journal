<?php

declare(strict_types=1);

namespace App\Navigation\Pipes;

use App\Bus\Contracts\Pipe;
use App\Models\Drivers\MenuEntry;
use App\Navigation\NavigationRaiseAnswer;
use App\Navigation\Values\NavigationAdmission;

/**
 * Answers with the owner's matching menu entry when it can be replayed.
 */
final readonly class ReplayMenuEntry implements Pipe
{
    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer|NavigationAdmission
    {
        $entry = MenuEntry::findReplayFor(
            $raise->owner,
            $raise->runtime,
            $raise->request->scriptGoal(),
            $raise->fingerprint(),
            $raise->command->declinedEntries,
        );

        if ($entry === null) {
            return $raise;
        }

        return NavigationRaiseAnswer::entry(
            $entry->libraryAnswer,
            isGuarded: $entry->wasProvenElsewhere($raise->runtime->driver_build),
        );
    }
}
