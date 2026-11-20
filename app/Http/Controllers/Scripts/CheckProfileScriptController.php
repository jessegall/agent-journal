<?php

declare(strict_types=1);

namespace App\Http\Controllers\Scripts;

use App\Profiles\Models\ProfileDraft;
use App\Profiles\Values\ProfileKey;
use App\Scripts\Calls\CheckProfileScriptCall;
use App\Scripts\Data\ProfileDraftData;
use App\Scripts\Readers\ProfileDraftReader;

/**
 * Checks unsaved script text against the language as it stands, saving nothing.
 */
final readonly class CheckProfileScriptController
{
    public function __invoke(CheckProfileScriptCall $call, ProfileDraftReader $drafts): ProfileDraftData
    {
        $revision = ProfileDraft::of(ProfileKey::from($call->profile))->revision;

        return $drafts->checked($call->profile, $revision, $call->scriptSource());
    }
}
