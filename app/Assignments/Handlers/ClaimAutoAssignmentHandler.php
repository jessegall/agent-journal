<?php

declare(strict_types=1);

namespace App\Assignments\Handlers;

use App\Assignments\Actions\AutoAssignmentAvailability;
use App\Assignments\Commands\AssignRecordForMaintenance;
use App\Assignments\Commands\ClaimAutoAssignment;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentWriter;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentRoom;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentOutcome;
use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Records\Support\RecordIdentity;

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

    public function handle(ClaimAutoAssignment $command): AutoAssignmentOutcome
    {
        $this->maintenance->assertMaintenanceGranted(AssignRecordForMaintenance::FILL_SCOPE);

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
        $assignmentChange = $this->commands->run(new AssignRecordForMaintenance($record, $holder));

        return $assignmentChange->hasChanges()
            ? AutoAssignmentOutcome::assigned($record)
            : AutoAssignmentOutcome::unchanged();
    }
}
