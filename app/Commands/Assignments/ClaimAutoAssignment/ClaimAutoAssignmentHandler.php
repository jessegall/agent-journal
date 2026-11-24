<?php

declare(strict_types=1);

namespace App\Commands\Assignments\ClaimAutoAssignment;

use App\Commands\Assignments\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Assignments\AssignedWorkResolver;
use App\Contracts\Assignments\AssignmentProviders;
use App\Contracts\Assignments\AutoAssignmentWriter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentRoom;
use App\Support\AutoAssignmentAvailability;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentOutcome;
use App\Support\RecordIdentity;

final readonly class ClaimAutoAssignmentHandler implements CommandHandler
{
    public function __construct(
        private MaintenanceAdmission $maintenance,
        private AutoAssignmentWriter $writer,
        private AutoAssignmentAvailability $availability,
        private AssignmentProviders $providers,
        private AssignedWorkResolver $work,
        private AssignmentRoom $room,
        private CommandBus $commands,
    ) {}

    public function handle(ClaimAutoAssignmentCommand $command): AutoAssignmentOutcome
    {
        $this->maintenance->assertMaintenanceGranted(AssignRecordForMaintenanceCommand::FILL_SCOPE);

        return $this->writer->claim($command->key, $this->claim(...));
    }

    private function claim(AutoAssignmentFact $fact): AutoAssignmentOutcome
    {
        if (! $this->availability->allows($fact)) {
            return AutoAssignmentOutcome::unavailable();
        }

        $actor = $fact->key->actor;
        $type = $fact->key->assignableType;
        $holder = AssigneeIdentity::ofActorIdentity($actor);
        $this->providers->assigneeProvider($holder->type)->requireEligible($holder);
        $held = $this->work->count($type, $holder);
        $room = min(1, $this->room->available($fact, $held));

        if ($room === 0) {
            return AutoAssignmentOutcome::full();
        }

        $pool = $this->providers->poolFactory($fact->pool->type)->open($fact->pool, $actor);
        $assigner = $this->providers->autoAssigner($type);
        $candidates = $assigner->pick($actor, $pool, $room)->ids;

        if ($candidates === []) {
            return AutoAssignmentOutcome::noCandidate();
        }

        $record = new RecordIdentity($type, $candidates[0]);
        $assigner->requireCandidate($record);
        $assignmentChange = $this->commands->run(new AssignRecordForMaintenanceCommand($record, $holder));

        if ($assignmentChange->hasChanges()) {
            return AutoAssignmentOutcome::assigned($record);
        }

        return AutoAssignmentOutcome::unchanged();
    }
}
