<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Models\MenuEntry;
use App\Pipelines\NavigationAdmission;
use App\Support\NavigationRaiseAnswer;

/**
 * Answers with the owner's matching menu entry when it can be replayed.
 */
final readonly class ReplayMenuEntry implements Pipe
{
    public function handle(NavigationAdmission $raise): NavigationRaiseAnswer|NavigationAdmission
    {
        $entry = MenuEntry::replayFor(
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
            $entry->libraryAnswer(),
            guarded: $entry->wasProvenElsewhere($raise->runtime->driver_build),
        );
    }
}
