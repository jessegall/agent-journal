<?php

declare(strict_types=1);

namespace App\Http\Controllers\Terminal;

use App\Bus\Attributes\Dispatches;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use App\Terminals\Commands\ReleaseTerminalControl\ReleaseTerminalControlCommand;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view gives the terminal's input back; the answer says releasing until the host fenced the grant.
 */
final readonly class ReleaseTerminalControlController
{
    #[Dispatches(ReleaseTerminalControlCommand::class)]
    public function __invoke(TerminalControlRequest $request, TerminalAnswers $answers): JsonResponse|Response
    {
        return $answers->control($request->releaseCommand());
    }
}
