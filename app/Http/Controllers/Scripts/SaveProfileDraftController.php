<?php

declare(strict_types=1);

namespace App\Http\Controllers\Scripts;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\SaveProfileDraft;
use App\Scripts\Calls\SaveProfileDraftCall;
use App\Scripts\Data\ProfileDraftData;
use App\Scripts\Readers\ProfileDraftReader;

/**
 * Saves the draft at the revision its writer read, kept even when it does not check, and answers what checking finds.
 */
final readonly class SaveProfileDraftController
{
    public function __invoke(
        SaveProfileDraftCall $call,
        CommandBus $commands,
        ProfileDraftReader $drafts,
    ): ProfileDraftData {
        $revision = $commands->run(new SaveProfileDraft(
            $call->profileKey(),
            $call->expectedRevision,
            $call->scriptSource(),
        ));

        return $drafts->checked($call->profile, $revision, $call->scriptSource());
    }
}
