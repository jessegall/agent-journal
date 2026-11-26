<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\ChooseTerminalDraft\ChooseTerminalDraftCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view chooses what becomes of the unsent line in the composer.
 */
final readonly class ChooseTerminalDraftController
{
    #[Dispatches(ChooseTerminalDraftCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->chooseCommand());
    }
}
