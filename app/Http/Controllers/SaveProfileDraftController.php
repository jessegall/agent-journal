<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Processes\Readers\ProfileDraftReader;
use App\Profiles\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Profiles\Data\ProfileDraftData;
use App\Scripts\Api\SaveProfileDraftPayload;

/**
 * Saves the draft at the revision its writer read, kept even when it does not check, and answers what checking finds.
 */
final readonly class SaveProfileDraftController
{
    #[Dispatches(SaveProfileDraftCommand::class)]
    public function __invoke(
        SaveProfileDraftPayload $call,
        CommandBus $commands,
        ProfileDraftReader $drafts,
    ): ProfileDraftData {
        $revision = $commands->run(new SaveProfileDraftCommand(
            $call->profileKey(),
            $call->expectedRevision,
            $call->scriptSource(),
        ));

        return $drafts->checked($call->profile, $revision, $call->scriptSource());
    }
}
