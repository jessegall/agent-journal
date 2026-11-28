<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Commands\NotifyRuntimeActivity;

use App\Actors\AttentionOrigin;
use App\Actors\Contracts\ActorAttention;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Events\Sessions\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Hosts\HostRuntimes;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Messages\Message;
use App\Processes\Enums\RuntimeActivity;
use App\Processes\Enums\RuntimeEventType;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;

final readonly class NotifyRuntimeActivityHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private CommandFacts $facts,
        private ActorAttention $attention,
    ) {}

    public function handle(NotifyRuntimeActivityCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        $event = $command->sequence === null ? null : RuntimeEvent::create(
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
        $agent = ActorReference::of($runtime->session->agent);

        if (Message::query()->unreadBy($runtime->session->agent)->exists()) {
            $this->attention->request($agent, AttentionOrigin::sessionProcess($runtime->id, $processGeneration));
        }
    }
}
