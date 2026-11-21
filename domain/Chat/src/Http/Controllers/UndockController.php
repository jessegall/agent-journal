<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use Domain\Chat\Commands\UndockSource;
use Domain\Chat\Data\UndockInput;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Support\DockRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class UndockController
{
    /**
     * Undocks the placement from the conversation with the agent; the source itself stays as it is.
     */
    public function __invoke(
        UndockInput $input,
        CommandBus $commands,
        DockRequests $requests,
        Redirector $redirect,
    ): RedirectResponse {
        $conversation = $requests->conversationWith($input->agent);
        $commands->run(new UndockSource($conversation->id, $input->placementId, $input->type, $input->id));

        return $redirect->route('home', ConversationRequest::queryFor($input->agent), 303);
    }
}
