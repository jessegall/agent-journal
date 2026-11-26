<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalViewRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\RenewTerminalView\RenewTerminalViewCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view keeps its own read interest live and gets it back as JSON; an ended interest is refused.
 */
final readonly class RenewTerminalController
{
    #[Dispatches(RenewTerminalViewCommand::class)]
    public function __invoke(TerminalViewRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->interest($request->renewCommand());
    }
}
