<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Api\Scripts\SaveProfileDraftPayload;
use App\Commands\Profiles\SaveProfileDraft\SaveProfileDraftCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Profiles\ProfileDraftData;
use App\Support\Readers\ProfileDraftReader;

/**
 * Saves the draft at the revision its writer read, kept even when it does not check, and answers what checking finds.
 */
final readonly class SaveProfileDraftController
{
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
