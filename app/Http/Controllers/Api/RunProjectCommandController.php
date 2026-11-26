<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Connections\ProjectCommandFrames;
use App\Api\Connections\RunProjectCommandPayload;
use App\Attributes\Bus\Dispatches;
use App\Commands\Projects\FinishProjectCommandRun\FinishProjectCommandRunCommand;
use App\Commands\Projects\RecordProjectCommandProcess\RecordProjectCommandProcessCommand;
use App\Commands\Projects\StartProjectCommandRun\StartProjectCommandRunCommand;
use App\Support\AgentContext;
use App\Support\ProjectCommands;
use App\Support\SignedCall;
use Illuminate\Http\Request;

/**
 * Runs a connected machine's journal verb as the calling start and answers every frame it wrote, ending with its
 * exit frame; the verb signs its own calls with the start's token and profile from this call.
 */
final readonly class RunProjectCommandController
{
    #[Dispatches(StartProjectCommandRunCommand::class)]
    #[Dispatches(FinishProjectCommandRunCommand::class)]
    #[Dispatches(RecordProjectCommandProcessCommand::class)]
    public function __invoke(
        RunProjectCommandPayload $call,
        Request $request,
        AgentContext $agent,
        ProjectCommands $commands,
    ): ProjectCommandFrames {
        $frames = $commands->run($call, $agent->agentId, [
            'JOURNAL_START_TOKEN' => (string) $request->bearerToken(),
            'JOURNAL_PROFILE' => (string) $request->header(SignedCall::PROFILE_HEADER),
            'JOURNAL_PROFILE_REVISION' => (string) $request->header(SignedCall::PROFILE_REVISION_HEADER),
        ]);

        return ProjectCommandFrames::ofFrames($frames);
    }
}
