<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Projects\RevokeProjectBinding\RevokeProjectBindingCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Responses\PageActionAnswers;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Revokes a connected folder and its host through the bus, once; the window's page is shown again with the outcome
 * beside the folder, and a JSON caller gets the outcome and the time the server took the revocation.
 */
final readonly class RevokeProjectBindingController
{
    #[Dispatches(RevokeProjectBindingCommand::class)]
    public function __invoke(
        string $binding,
        Request $request,
        CommandBus $commands,
        PageActionAnswers $answers,
    ): JsonResponse|RedirectResponse {
        $outcome = $commands->run(new RevokeProjectBindingCommand($binding));

        if ($request->expectsJson()) {
            return new JsonResponse([
                'bindingId' => $outcome->id,
                'result' => $outcome->result,
                'revokedAt' => $outcome->revokedAt,
            ]);
        }

        $revoked = [$outcome->id => $outcome->result];

        return $answers->backWith(RevokeProjectBindingsController::REVOKED_BINDINGS, $revoked);
    }
}
