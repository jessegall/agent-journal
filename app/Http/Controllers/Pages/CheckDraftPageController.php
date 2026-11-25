<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Calls\Scripts\CheckProfileScriptCall;
use App\Http\Responses\PageActionAnswers;
use App\Models\Profiles\ProfileDraft;
use App\Support\Readers\ProfileDraftReader;
use App\Values\ProfileKey;
use Illuminate\Http\RedirectResponse;

/**
 * The script editor's check of its unsaved text, saving nothing: the page is shown again with what checking found as a
 * one-time flash, so the text never enters the page's props or history.
 */
final readonly class CheckDraftPageController
{
    /**
     * The flash key the editor reads the checked draft from.
     */
    public const string CHECKED_DRAFT = 'checkedDraft';

    public function __invoke(
        CheckProfileScriptCall $call,
        ProfileDraftReader $drafts,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $revision = ProfileDraft::createForProfile(ProfileKey::from($call->profile))->revision;

        $checked = $drafts->checked($call->profile, $revision, $call->scriptSource());

        return $answers->backWith(self::CHECKED_DRAFT, $checked);
    }
}
