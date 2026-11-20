<?php

declare(strict_types=1);

namespace App\Agents\Pipes;

use App\Agents\Models\MenuEntry;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Agents\Values\NavigationAdmission;
use App\Pipelines\Contracts\Pipe;

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
            guarded: $entry->wasProvenElsewhere($raise->runtime->program_build),
        );
    }
}
