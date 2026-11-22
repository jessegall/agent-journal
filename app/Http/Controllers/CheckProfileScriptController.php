<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Calls\Scripts\CheckProfileScriptCall;
use App\Data\ProfileDraftData;
use App\Models\ProfileDraft;
use App\Support\Readers\ProfileDraftReader;
use App\Values\ProfileKey;

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
