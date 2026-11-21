<?php

declare(strict_types=1);

namespace App\Connections\Http\Controllers\Calls;

use App\Agents\Support\AgentContext;
use App\Connections\Calls\ProjectCommandStatus;
use App\Connections\Calls\ReadProjectCommandStatusCall;
use App\Connections\Enums\CommandRunState;
use App\Connections\Exceptions\VerbNotServed;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\ProjectCommandRun;
use App\Connections\Support\CommandRunEvidence;

/**
 * Answers where the calling agent's own run of the request id on its own binding stands, settled by what can be
 * proved of its worker and process, with the frames it recorded; any other run, or none, reads unknown alike, so a
 * lookup refused reveals nothing. It writes and starts nothing.
 */
final readonly class ReadProjectCommandStatusController
{
    public function __invoke(
        ReadProjectCommandStatusCall $call,
        AgentContext $agent,
        CommandRunEvidence $evidence,
    ): ProjectCommandStatus {
        $own = array_filter(
            ProjectBinding::ofMainAgent($agent->agentId),
            fn (ProjectBinding $binding) => $binding->id === $call->bindingId,
        );

        if ($own === []) {
            throw VerbNotServed::notYourBinding($call->bindingId);
        }

        foreach (ProjectCommandRun::ofRequestBy($call->requestKey, $agent->agentId, $call->bindingId) as $run) {
            $state = $run->settledStateBy($evidence);

            return ProjectCommandStatus::of($state, $state->isActive() ? [] : $run->recordedFrames());
        }

        return ProjectCommandStatus::of(CommandRunState::Unknown, []);
    }
}
