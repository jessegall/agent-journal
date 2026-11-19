<?php

declare(strict_types=1);

namespace App\Http\Controllers\Profiles;

use App\Agents\Support\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Profiles\SignInChallengeRequest;
use App\Profiles\Commands\PublishSignInChallenge;
use Illuminate\Http\Response;

/**
 * Takes the challenge the host's program printed for the attempt it runs. The host's calls run as the journal itself.
 */
final readonly class PublishSignInChallengeController
{
    public function __invoke(SignInChallengeRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new PublishSignInChallenge(
            $host->hostId,
            $request->attemptId(),
            $request->address(),
            $request->code(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
