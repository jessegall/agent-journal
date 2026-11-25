<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Attributes\Bus\Dispatches;
use App\Commands\Terminals\CloseTerminalView\CloseTerminalViewCommand;
use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view ends its own read interest; the viewer's other views keep theirs.
 */
final readonly class CloseTerminalController
{
    #[Dispatches(CloseTerminalViewCommand::class)]
    public function __invoke(TerminalViewRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->run($request->closeCommand());
    }
}
