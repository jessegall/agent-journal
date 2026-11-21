<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers\Calls;

use App\AgentRequests\Support\SignedCall;
use App\Agents\Support\AgentContext;
use App\Connections\Calls\ProjectCommandFrames;
use App\Connections\Calls\RunProjectCommandCall;
use App\Connections\Support\ProjectCommands;
use Illuminate\Http\Request;

/**
 * Runs a connected machine's journal verb as the calling start and answers every frame it wrote, ending with its
 * exit frame; the verb signs its own calls with the start's token and profile from this call.
 */
final readonly class RunProjectCommandController
{
    public function __invoke(
        RunProjectCommandCall $call,
        Request $request,
        AgentContext $agent,
        ProjectCommands $commands,
    ): ProjectCommandFrames {
        $frames = $commands->run($call, $agent->agentId, [
            'JOURNAL_START_TOKEN' => (string) $request->bearerToken(),
            'JOURNAL_PROFILE' => (string) $request->header(SignedCall::PROFILE_HEADER),
            'JOURNAL_PROFILE_REVISION' => (string) $request->header(SignedCall::PROFILE_REVISION_HEADER),
        ]);

        return ProjectCommandFrames::fromFrames($frames);
    }
}
