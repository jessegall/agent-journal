<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Chat\Data\DeclineInput;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

final readonly class DeclineQuestionController
{
    /**
     * Declines a chat question the viewer was asked, with a reason; the server checks it is the respondent.
     */
    public function __invoke(DeclineInput $input, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DeclineChatQuestionCommand($input->messageId, $input->reason));

        return $redirect->back(303);
    }
}
