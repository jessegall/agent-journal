<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Assignments\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Assignments\Commands\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentTrigger;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentRoom;
use App\Assignments\Support\AutoAssignmentBudget;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentRun;
use App\Assignments\Support\Page;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandStops;
use App\Bus\Contracts\StopTime;
use App\Bus\Contracts\StopTimes;
use Psr\Log\LoggerInterface;
use Throwable;

final readonly class AssignmentTurns implements AutoAssignmentTrigger
{
    private const int FACT_LIMIT = 20;

    private const int CLAIM_LIMIT = 5;

    public function __construct(
        private MaintenanceAdmission $maintenance,
        private AutoAssignmentResolver $assignments,
        private AutoAssignmentAvailability $availability,
        private AssignedWorkResolver $work,
        private AssignmentRoom $room,
        private AssignmentProviders $providers,
        private CommandBus $commands,
        private CommandStops $commandStops,
        private StopTimes $stopTimes,
        private LoggerInterface $logger,
    ) {}

    public function consider(AutoAssignmentBudget $budget): AutoAssignmentRun
    {
        $this->maintenance->assertMaintenanceGranted(AssignRecordForMaintenanceCommand::FILL_SCOPE);
        $stop = $this->stopTimes->at($budget->stopNanoseconds);

        if ($stop->remainingMilliseconds() <= 0 || $budget->isEmpty()) {
            return new AutoAssignmentRun(0, 0, 0, 0, $budget->afterId);
        }

        return $this->commandStops->runUntil($stop, fn () => $this->takeTurns($budget, $stop));
    }

    private function takeTurns(AutoAssignmentBudget $budget, StopTime $stop): AutoAssignmentRun
    {
        $page = $this->assignments->enabled(new Page($budget->afterId, min($budget->factLimit, self::FACT_LIMIT)));

        if ($page->facts === []) {
            return new AutoAssignmentRun(0, 0, 0, 0, null);
        }

        $nextAfterId = $page->facts[array_key_last($page->facts)]->id;

        $ready = array_values(
            array_filter($page->facts, fn (AutoAssignmentFact $fact) => $this->mayTakeTurn($fact, $stop)),
        );

        usort($ready, static fn (AutoAssignmentFact $one, AutoAssignmentFact $other): int => $one->compareTurn($other));
        $started = 0;
        $assigned = 0;
        $failed = 0;

        foreach (array_slice($ready, 0, min($budget->claimLimit, self::CLAIM_LIMIT)) as $fact) {
            if ($stop->remainingMilliseconds() <= 0) {
                break;
            }

            $started++;

            try {
                $outcome = $this->commands->run(new ClaimAutoAssignmentCommand($fact->key));
            } catch (Throwable $failure) {
                $failed++;
                $this->warn($fact, $failure);

                continue;
            }

            if ($outcome->isAssigned()) {
                $assigned++;
            }
        }

        return new AutoAssignmentRun(count($page->facts), $started, $assigned, $failed, $nextAfterId);
    }

    private function mayTakeTurn(AutoAssignmentFact $fact, StopTime $stop): bool
    {
        if (! $fact->enabled || $stop->remainingMilliseconds() <= 0 || ! $this->availability->domainsEnabled($fact)) {
            return false;
        }

        if ($stop->remainingMilliseconds() <= 0 || ! $this->availability->isActive($fact)) {
            return false;
        }

        if ($stop->remainingMilliseconds() <= 0) {
            return false;
        }

        $held = $this->work->count($fact->key->assignableType, AssigneeIdentity::ofActorIdentity($fact->key->actor));

        return $this->room->available($fact, $held) > 0;
    }

    private function warn(AutoAssignmentFact $fact, Throwable $failure): void
    {
        $key = $fact->key;

        $this->logger->warning('Auto-assignment claim failed.', [
            ...$key->actor->asColumns('actor'),
            'type' => $key->assignableType,
            'provider' => $this->providers->autoAssignerClass($key->assignableType),
            'failure' => $failure::class,
            'exception' => $failure,
        ]);
    }
}
