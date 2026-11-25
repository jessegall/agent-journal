<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Connections\ProjectCommandStatus;
use App\Calls\Connections\ReadProjectCommandStatusCall;
use App\Enums\Connections\CommandRunState;
use App\Exceptions\VerbNotServed;
use App\Models\Projects\ProjectBinding;
use App\Models\Projects\ProjectCommandRun;
use App\Support\AgentContext;
use App\Support\CommandRunEvidence;

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
            ProjectBinding::findForMainAgent($agent->agentId),
            fn (ProjectBinding $binding) => $binding->id === $call->bindingId,
        );

        if ($own === []) {
            throw VerbNotServed::notYourBinding($call->bindingId);
        }

        foreach (ProjectCommandRun::findForRequestBy($call->requestKey, $agent->agentId, $call->bindingId) as $run) {
            $state = $run->settledStateBy($evidence);

            return ProjectCommandStatus::of($state, $state->isActive() ? [] : $run->recordedFrames());
        }

        return ProjectCommandStatus::of(CommandRunState::Unknown, []);
    }
}
