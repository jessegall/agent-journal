<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\CleanupReportRequest;
use App\Profiles\Commands\CleanAccount;
use Illuminate\Http\Response;

/**
 * Takes the host's cleanup proofs for a removed account. The host's calls run as the journal itself.
 */
final readonly class ReportAccountCleanupController
{
    public function __invoke(CleanupReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new CleanAccount(
            $host->hostId,
            $request->targetId(),
            $request->generation(),
            $request->progress(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
