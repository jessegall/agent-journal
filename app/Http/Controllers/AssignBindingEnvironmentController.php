<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Projects\AssignBindingEnvironment\AssignBindingEnvironmentCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Assigns a binding with no environment the environment the owner chose, through the bus.
 */
final readonly class AssignBindingEnvironmentController
{
    #[Dispatches(AssignBindingEnvironmentCommand::class)]
    public function __invoke(
        string $binding,
        string $environment,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $commands->run(new AssignBindingEnvironmentCommand($binding, $environment));

        if ($request->expectsJson()) {
            return new Response(status: Response::HTTP_NO_CONTENT);
        }

        return $redirect->back(303);
    }
}
