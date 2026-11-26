<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Accounts\Commands\NotifySignIn\NotifySignInCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\SignInReportRequest;
use Illuminate\Http\Response;

/**
 * Takes the host's sign-in runner's safe report on the attempt it runs. The host's calls run as the journal itself.
 */
final readonly class ReportSignInController
{
    #[Dispatches(NotifySignInCommand::class)]
    public function __invoke(SignInReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifySignInCommand(
            $host->hostId,
            $request->attemptId(),
            $request->generation(),
            $request->outcome(),
            $request->identity(),
            $request->refusal(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
