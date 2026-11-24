<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Commands\NotifySignIn\NotifySignInCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Profiles\SignInReportRequest;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's sign-in runner's safe report on the attempt it runs. The host's calls run as the journal itself.
 */
final readonly class ReportSignInController
{
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
