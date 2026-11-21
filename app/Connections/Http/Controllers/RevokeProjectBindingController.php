<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeProjectBinding;
use Illuminate\Http\Response;

/**
 * Revokes a connected folder and its host through the bus.
 */
final readonly class RevokeProjectBindingController
{
    public function __invoke(string $binding, CommandBus $commands): Response
    {
        $commands->run(new RevokeProjectBinding($binding));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
