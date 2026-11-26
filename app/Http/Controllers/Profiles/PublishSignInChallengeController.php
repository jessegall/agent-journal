<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Accounts\Commands\PublishSignInChallenge\PublishSignInChallengeCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Hosts\Values\HostContext;
use App\Http\Requests\Profiles\SignInChallengeRequest;
use Illuminate\Http\Response;

/**
 * Takes the challenge the host's driver printed for the attempt it runs. The host's calls run as the journal itself.
 */
final readonly class PublishSignInChallengeController
{
    #[Dispatches(PublishSignInChallengeCommand::class)]
    public function __invoke(SignInChallengeRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new PublishSignInChallengeCommand(
            $host->hostId,
            $request->attemptId(),
            $request->address(),
            $request->code(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
