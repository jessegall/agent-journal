<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Access\Contracts\CurrentAuthorizer;
use App\Access\Contracts\MaintenanceAdmission;
use App\Actors\Contracts\CurrentActor;
use App\Assignments\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Assignments\Contracts\AssigneeLocks;
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Policies\AssignmentRecipientPolicy;
use App\Projects\ProjectEdges;
use App\Support\AssigneeIdentity;
use App\Support\RecordIdentity;

/**
 * Admits public assignments in one order: public purpose, the caller's authority over the requested recipient, the
 * recipient's lock, one resolution of the recipient, the final holder's lock, the record and that holder and record
 * are of one project. The caller's own seat never takes part.
 */
final readonly class AdmitPublicAssignments
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentAuthorizer $authorizer,
        private AssignmentProviders $providers,
        private AssigneeLocks $locks,
        private AssignmentDestinationResolver $destinations,
        private MaintenanceAdmission $maintenance,
        private ProjectEdges $edges,
    ) {}

    public function admitPublic(RecordIdentity $record, AssigneeIdentity $requested): AdmittedAssignment
    {
        $this->providers->assertPublic($record->type);
        $caller = AssigneeIdentity::of($this->actors->actor());
        $access = AssignmentRecipientPolicy::accessFor($caller, $requested);
        $this->authorizer->authorize(AssignmentRecipientPolicy::class, AssignmentRecipientPolicy::model(), $access);

        return $this->resolve($record, $requested);
    }

    public function admitMaintenance(RecordIdentity $record, AssigneeIdentity $requested): AdmittedAssignment
    {
        $this->providers->assertPublic($record->type);
        $this->maintenance->assertMaintenanceGranted(AssignRecordForMaintenanceCommand::FILL_SCOPE);

        return $this->resolve($record, $requested);
    }

    private function resolve(RecordIdentity $record, AssigneeIdentity $requested): AdmittedAssignment
    {
        $this->locks->lockShared([$requested]);
        $holder = $this->destinations->resolve($requested);
        $resolved = $holder->assigneeIdentity();
        $this->locks->lockShared([$resolved]);
        $assignable = $this->providers->recordProvider($record->type)->requireAssignable($record);
        $this->edges->assertJoinable($holder, $assignable);

        return new AdmittedAssignment($record, $requested, $resolved);
    }
}
