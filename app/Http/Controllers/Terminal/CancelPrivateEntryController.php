<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\CancelPrivateEntry\CancelPrivateEntryCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view leaves private entry without a value.
 */
final readonly class CancelPrivateEntryController
{
    #[Dispatches(CancelPrivateEntryCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->cancelPrivateCommand());
    }
}
