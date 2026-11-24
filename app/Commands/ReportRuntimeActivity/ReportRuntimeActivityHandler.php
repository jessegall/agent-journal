<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeActivity;

use App\Contracts\Actors\ActorAttention;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\RuntimeActivity;
use App\Enums\RuntimeEventType;
use App\Events\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Support\ActorIdentity;
use App\Support\AttentionOrigin;
use App\Support\HostRuntimes;
use App\Support\MessageBatchService;
use Carbon\CarbonImmutable;

final readonly class ReportRuntimeActivityHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private CommandFacts $facts,
        private MessageBatchService $messageBatches,
        private ActorAttention $attention,
    ) {}

    public function handle(ReportRuntimeActivityCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        $event = $command->sequence === null ? null : RuntimeEvent::record(
            $runtime,
            $command->processGeneration,
            $command->sequence,
            RuntimeEventType::Activity,
            null,
        );

        if ($event?->isReplay === true) {
            return;
        }

        // A report missing before an idle one may be a turn's end: its requests are left uncertain, never settled by
        // the idle screen that came after.
        if ($event?->followsGap === true && $command->activity === RuntimeActivity::Idle) {
            $applying = DriverRequest::query()->applyingOn($runtime)
                ->readAll('the requests of one runtime\'s running turn')
                ->get();

            foreach ($applying as $request) {
                $request->markUncertain();
            }
        }

        $isNewProcess = $command->processGeneration > $runtime->process_generation;

        if (! $runtime->recordObservation(
            $command->activity,
            $command->hold,
            $command->processGeneration,
            CarbonImmutable::now(),
        )) {
            throw HostReportRefused::staleGeneration(
                $runtime->id,
                $command->processGeneration,
                $runtime->process_generation,
            );
        }

        // A new process starts a new context, so text the old one was shown is presented to it again from a wake.
        if ($isNewProcess && $command->activity === RuntimeActivity::Idle) {
            $this->presentBacklog($runtime, $command->processGeneration);
        }

        $this->facts->publishAfterCommit(new SessionStateChanged($runtime->agent_session_id));
    }

    private function presentBacklog(AgentRuntime $runtime, int $processGeneration): void
    {
        $runtime->loadMissing('session.agent');
        $agent = ActorIdentity::of($runtime->session->agent);

        if ($this->messageBatches->hasUnshownText($agent)) {
            $this->attention->request($agent, AttentionOrigin::processStart($runtime->id, $processGeneration));
        }
    }
}
