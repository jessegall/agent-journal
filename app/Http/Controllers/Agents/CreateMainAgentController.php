<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\CreateMainAgent\CreateMainAgentCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\CreateMainAgentRequest;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\RedirectResponse;

/**
 * Opens a new chat with another main agent: the page's form returns to the page with the new agent's id flashed, so
 * the page opens its chat as a tab and sends the first message there.
 */
final readonly class CreateMainAgentController
{
    /**
     * The flash key a form reads the new agent's id from.
     */
    public const string CREATED_AGENT = 'createdAgentId';

    #[Dispatches(CreateMainAgentCommand::class)]
    public function __invoke(
        CreateMainAgentRequest $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): RedirectResponse {
        $actor = $commands->run($request->command());

        return $answers->backWith(self::CREATED_AGENT, $actor->id);
    }
}
