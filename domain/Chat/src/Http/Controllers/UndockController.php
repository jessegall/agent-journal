<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\UndockSource;
use Domain\Chat\Data\UndockInput;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class UndockController
{
    /**
     * Undocks the placement from the chat the inbox names; the source itself stays as it is.
     */
    public function __invoke(
        UndockInput $input,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new UndockSource($input->inboxId, $input->placementId, $input->type, $input->id));

        $home = $redirect->getUrlGenerator()->route('home', ConversationRequest::queryFor($input->agent), false);

        // The page that showed the dock, Home or Chat's own, is shown again on the same dock page.
        return $redirect->back(303, [], $home);
    }
}
