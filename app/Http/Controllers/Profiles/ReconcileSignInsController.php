<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\SignInReconcileRequest;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host runner's list of the sign-ins it still runs. The host's calls run as the journal itself.
 */
final readonly class ReconcileSignInsController
{
    public function __invoke(SignInReconcileRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReconcileSignInsCommand($host->hostId, $request->runningAttemptIds()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
