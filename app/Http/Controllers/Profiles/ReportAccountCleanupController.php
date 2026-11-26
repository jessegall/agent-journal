<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Accounts\Commands\CleanAccount\CleanAccountCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\CleanupReportRequest;
use Illuminate\Http\Response;

/**
 * Takes the host's cleanup proofs for a removed account. The host's calls run as the journal itself.
 */
final readonly class ReportAccountCleanupController
{
    #[Dispatches(CleanAccountCommand::class)]
    public function __invoke(CleanupReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new CleanAccountCommand(
            $host->hostId,
            $request->targetId(),
            $request->generation(),
            $request->progress(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
