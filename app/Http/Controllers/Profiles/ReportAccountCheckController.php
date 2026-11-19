<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\AccountCheckRequest;
use App\Profiles\Commands\CheckAccount;
use Illuminate\Http\Response;

/**
 * Takes the host's account check. The host's calls run as the journal itself.
 */
final readonly class ReportAccountCheckController
{
    public function __invoke(AccountCheckRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new CheckAccount(
            $host->hostId,
            $request->accountId(),
            $request->generation(),
            $request->result(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
