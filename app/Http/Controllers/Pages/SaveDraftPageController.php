<?php

declare(strict_types=1);

namespace App\Http\Controllers\Pages;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Responses\PageActionAnswers;
use App\Processes\Readers\ProfileDraftReader;
use App\Profiles\Commands\SaveProfileDraft\SaveProfileDraftCommand;
use App\Scripts\Api\SaveProfileDraftPayload;
use Illuminate\Http\RedirectResponse;

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

    #[Dispatches(SaveProfileDraftCommand::class)]
    public function __invoke(
        SaveProfileDraftPayload $call,
        CommandBus $commands,
        ProfileDraftReader $drafts,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $revision = $commands->run(new SaveProfileDraftCommand(
            $call->profileKey(),
            $call->expectedRevision,
            $call->scriptSource(),
        ));

        $checked = $drafts->checked($call->profile, $revision, $call->scriptSource());

        return $answers->backWith(self::SAVED_DRAFT, $checked);
    }
}
