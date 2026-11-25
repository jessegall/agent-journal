<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Attributes\Bus\Dispatches;
use App\Commands\Terminals\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
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
