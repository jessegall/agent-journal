<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Attributes\Bus\Dispatches;
use App\Commands\Accounts\CheckAccount\CheckAccountCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\AccountCheckRequest;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's account check. The host's calls run as the journal itself.
 */
final readonly class ReportAccountCheckController
{
    #[Dispatches(CheckAccountCommand::class)]
    public function __invoke(AccountCheckRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new CheckAccountCommand(
            $host->hostId,
            $request->accountId(),
            $request->generation(),
            $request->result(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
