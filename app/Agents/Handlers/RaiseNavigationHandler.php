<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\JournalAdmission;
use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\RaiseNavigation;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Exceptions\NavigationRaiseRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Pipelines\NavigationAdmission;
use App\Agents\Pipelines\ResolveNavigationAdmissionPipeline;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\NavigationDispatch;
use App\Agents\Support\NavigationRaiseAnswer;
use App\Contracts\CommandHandler;
use App\Pipelines\Contracts\PipelineRunner;

/**
 * Takes a host's raise at an uncertain point: the user keeps holding the main agent's own runtime, a runtime waits
 * behind another one's open request of the same menu, and any other raise opens one navigation request, holds the
 * runtime for it and puts it in front of the main desk. A repeated raise answers what the first did.
 */
final readonly class RaiseNavigationHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationDispatch $dispatch,
        private JournalAdmission $admission,
        private PipelineRunner $pipelines,
    ) {}

    /**
     * @throws HostReportRefused
     * @throws NavigationRaiseRefused
     */
    public function handle(RaiseNavigation $command): NavigationRaiseAnswer
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId)->load('session.agent');
        $request = $this->stalledScript($command, $runtime);
        $raisedBefore = NavigationRequest::raisedForOperation($runtime->id, $command->operationKey);

        if ($raisedBefore !== null) {
            return NavigationRaiseAnswer::opened($raisedBefore->id);
        }

        return $this->pipelines->run(
            ResolveNavigationAdmissionPipeline::class,
            new NavigationAdmission(
                $command,
                $runtime,
                $request,
                ActorIdentity::of($this->admission->owner()),
                $this->dispatch,
            ),
            NavigationRaiseAnswer::class,
        );
    }

    /**
     * The key script request of the runtime that stalled, at the attempt the host ran, with its runtime.
     *
     * @throws NavigationRaiseRefused
     * @throws HostReportRefused
     */
    private function stalledScript(RaiseNavigation $command, AgentRuntime $runtime): DriverRequest
    {
        $request = DriverRequest::query()
            ->whereKey($command->requestId)
            ->where('agent_runtime_id', $runtime->id)
            ->lockForUpdate()
            ->firstOr(fn () => throw NavigationRaiseRefused::notOfRuntime($command->requestId, $runtime->id));

        if (! $request->isKeyScript()) {
            throw NavigationRaiseRefused::notAKeyScript($request->id);
        }

        if ($command->attempt !== $request->attempt_version) {
            throw HostReportRefused::staleAttempt($request->id, $command->attempt, $request->attempt_version);
        }

        $request->setRelation('runtime', $runtime);

        return $request;
    }
}
