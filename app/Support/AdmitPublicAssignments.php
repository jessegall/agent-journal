<?php

declare(strict_types=1);

namespace App\Support;

use App\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Contracts\AssigneeLocks;
use App\Contracts\AssignmentDestinationResolver;
use App\Contracts\AssignmentProviders;
use App\Contracts\CurrentActor;
use App\Contracts\CurrentAuthorizer;
use App\Contracts\MaintenanceAdmission;
use App\Policies\AssignmentRecipientPolicy;

/**
 * Admits public assignments in one order: public purpose, the caller's authority over the requested recipient, the
 * recipient's lock, one resolution of the recipient, the final holder's lock and the record. The caller's own seat
 * never takes part.
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
        $resolved = $this->destinations->resolve($requested)->assigneeIdentity();
        $this->locks->lockShared([$resolved]);
        $this->providers->recordProvider($record->type)->requireAssignable($record);

        return new AdmittedAssignment($record, $requested, $resolved);
    }
}
