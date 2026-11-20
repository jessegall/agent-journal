<?php

declare(strict_types=1);

namespace App\Assignments\Actions;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Contracts\AssigneeLocks;
use App\Assignments\Contracts\AssignmentDestinationResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Assignments\Enums\AssignmentAbility;
use App\Assignments\Exceptions\AssignmentDenied;
use App\Assignments\Policies\AssignmentPolicy;
use App\Assignments\Support\AdmittedAssignment;
use App\Assignments\Support\AssigneeIdentity;
use App\Records\Support\RecordIdentity;

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
        $this->providers->requirePublic($record->type);
        $actor = $this->actors->actor();

        if ($actor->type === ActorType::Engine) {
            throw AssignmentDenied::forCaller(ActorIdentity::of($actor));
        }

        $caller = AssigneeIdentity::of($actor);
        $ability = AssignmentAbility::forRecipient($caller, $requested);
        $this->authorizer->authorize(AssignmentPolicy::class, $requested, $ability);

        return $this->resolve($record, $requested);
    }

    public function admitMaintenance(RecordIdentity $record, AssigneeIdentity $requested): AdmittedAssignment
    {
        $this->providers->requirePublic($record->type);
        $this->maintenance->checkMaintenance(AssignRecord::MAINTENANCE_SCOPE);

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
