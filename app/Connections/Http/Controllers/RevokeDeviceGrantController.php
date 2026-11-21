<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Connections\Commands\RevokeDeviceGrant;
use Illuminate\Http\Response;

/**
 * The owner revokes a device grant.
 */
final readonly class RevokeDeviceGrantController
{
    public function __invoke(string $grant, CommandBus $commands): Response
    {
        $commands->run(new RevokeDeviceGrant($grant));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
