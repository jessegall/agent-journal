<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Accounts\Commands\ReconcileSignIns\ReconcileSignInsCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\SignInReconcileRequest;
use Illuminate\Http\Response;

/**
 * Takes the host runner's list of the sign-ins it still runs. The host's calls run as the journal itself.
 */
final readonly class ReconcileSignInsController
{
    #[Dispatches(ReconcileSignInsCommand::class)]
    public function __invoke(SignInReconcileRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReconcileSignInsCommand($host->hostId, $request->runningAttemptIds()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
