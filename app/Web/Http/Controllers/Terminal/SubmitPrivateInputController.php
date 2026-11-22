<?php

declare(strict_types=1);

namespace App\Web\Http\Controllers\Terminal;

use App\Agents\Support\PrivateValues;
use App\Http\Requests\Agents\TerminalControlRequest;
use App\Http\Responses\Agents\TerminalAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * A view sends a private value once: the value goes only into the short-lived cache entry the host's claim reads and
 * deletes, the command names the submission alone, and a refused submission drops the value at once.
 */
final readonly class SubmitPrivateInputController
{
    public function __invoke(
        TerminalControlRequest $request,
        PrivateValues $values,
        TerminalAnswers $answers,
    ): JsonResponse|Response {
        $values->keep($request->submissionId(), $request->privateValue());
        $answer = $answers->control($request->submitPrivateCommand());

        if (! $answer->isSuccessful()) {
            $values->discard($request->submissionId());
        }

        return $answer;
    }
}
