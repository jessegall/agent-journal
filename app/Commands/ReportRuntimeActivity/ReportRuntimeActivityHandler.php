<?php

declare(strict_types=1);

namespace App\Commands\ReportRuntimeActivity;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\RuntimeActivity;
use App\Enums\RuntimeEventType;
use App\Events\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Support\HostRuntimes;
use Carbon\CarbonImmutable;

final readonly class ReportRuntimeActivityHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes, private CommandFacts $facts) {}

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

        $this->facts->publishAfterCommit(new SessionStateChanged($runtime->agent_session_id));
    }
}
