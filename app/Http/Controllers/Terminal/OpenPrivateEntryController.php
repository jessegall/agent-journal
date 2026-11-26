<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\OpenPrivateEntry\OpenPrivateEntryCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view asks the host to close every output sink for a private entry.
 */
final readonly class OpenPrivateEntryController
{
    #[Dispatches(OpenPrivateEntryCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->openPrivateCommand());
    }
}
