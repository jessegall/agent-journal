<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\RenewTerminalControl\RenewTerminalControlCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view keeps its control of the agent's terminal; control is checked again.
 */
final readonly class RenewTerminalControlController
{
    #[Dispatches(RenewTerminalControlCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->renewCommand());
    }
}
