<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\AssignBindingEnvironment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Assigns a binding with no environment the environment the owner chose, through the bus.
 */
final readonly class AssignBindingEnvironmentController
{
    public function __invoke(
        string $binding,
        string $environment,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $commands->run(new AssignBindingEnvironment($binding, $environment));

        return $request->expectsJson() ? new Response(status: Response::HTTP_NO_CONTENT) : $redirect->back(303);
    }
}
