<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Calls\Scripts\CheckProfileScriptCall;
use App\Models\ProfileDraft;
use App\Support\Readers\ProfileDraftReader;
use App\Values\ProfileKey;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

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
        ResponseFactory $inertia,
        Redirector $redirect,
    ): RedirectResponse {
        $revision = ProfileDraft::of(ProfileKey::from($call->profile))->revision;
        $inertia->flash(self::CHECKED_DRAFT, $drafts->checked($call->profile, $revision, $call->scriptSource()));

        return $redirect->back(303);
    }
}
