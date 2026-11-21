<?php

declare(strict_types=1);

namespace App\Scripts\Http\Controllers\Pages;

use App\Bus\Contracts\CommandBus;
use App\Profiles\Commands\SaveProfileDraft;
use App\Scripts\Calls\SaveProfileDraftCall;
use App\Scripts\Readers\ProfileDraftReader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * The script editor saves its draft at the revision it read; the page is shown again with the saved draft and what
 * checking finds as a one-time flash, and a refusal arrives as the page's errors.
 */
final readonly class SaveDraftPageController
{
    /**
     * The flash key the editor reads the saved draft from.
     */
    public const string SAVED_DRAFT = 'savedDraft';

    public function __invoke(
        SaveProfileDraftCall $call,
        CommandBus $commands,
        ProfileDraftReader $drafts,
        ResponseFactory $inertia,
        Redirector $redirect,
    ): RedirectResponse {
        $revision = $commands->run(new SaveProfileDraft(
            $call->profileKey(),
            $call->expectedRevision,
            $call->scriptSource(),
        ));
        $inertia->flash(self::SAVED_DRAFT, $drafts->checked($call->profile, $revision, $call->scriptSource()));

        return $redirect->back(303);
    }
}
