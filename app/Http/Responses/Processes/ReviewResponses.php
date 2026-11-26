<?php

declare(strict_types=1);

namespace App\Http\Responses\Processes;

use App\Bus\Contracts\Command;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandRefusal;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Runs an owner's review action from a page and goes back to it; a refusal, such as a stale revision, is shown on the
 * page with the current state instead of failing the request.
 */
final readonly class ReviewResponses
{
    public function __construct(private CommandBus $commands, private Redirector $redirect) {}

    /**
     * @param  Command<mixed>  $command
     */
    public function run(Command $command): RedirectResponse
    {
        try {
            $this->commands->run($command);
        } catch (CommandRefusal $refusal) {
            return $this->redirect->back(303)->withErrors(['review' => $refusal->getMessage()]);
        }

        return $this->redirect->back(303);
    }
}
