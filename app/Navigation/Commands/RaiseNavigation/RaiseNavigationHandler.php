<?php

declare(strict_types=1);

namespace App\Navigation\Commands\RaiseNavigation;

use App\Access\Contracts\JournalAdmission;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\PipelineRunner;
use App\Exceptions\HostReportRefused;
use App\Exceptions\NavigationRaiseRefused;
use App\Hosts\HostRuntimes;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\NavigationRequest;
use App\Navigation\NavigationDispatch;
use App\Navigation\NavigationRaiseAnswer;
use App\Navigation\Pipelines\ResolveNavigationAdmissionPipeline;
use App\Navigation\Values\NavigationAdmission;

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
    public function handle(RaiseNavigationCommand $command): NavigationRaiseAnswer
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId)->load('session.agent');
        $request = $this->stalledScript($command, $runtime);
        $raisedBefore = NavigationRequest::findRaisedForOperation($runtime->id, $command->operationKey);

        if ($raisedBefore !== null) {
            return NavigationRaiseAnswer::opened($raisedBefore->id);
        }

        return $this->pipelines->run(
            ResolveNavigationAdmissionPipeline::class,
            new NavigationAdmission(
                $command,
                $runtime,
                $request,
                $this->admission->owner(),
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
    private function stalledScript(RaiseNavigationCommand $command, AgentRuntime $runtime): DriverRequest
    {
        $request = DriverRequest::query()
            ->whereKey($command->requestId)
            ->ofAgentRuntime($runtime->id)
            ->lockForUpdate()
            ->firstOr(NavigationRaiseRefused::throwing()->notOfRuntime($command->requestId, $runtime->id));

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
