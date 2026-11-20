<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Values\Operation;
use App\Agents\Values\OperationKey;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Support\CommandRegistry;
use App\Hooks\Contracts\OperationPolicy;
use App\Supervision\Contracts\AskAdmission;
use App\Supervision\Exceptions\AskRefused;
use App\Supervision\Values\AdmittedAsk;
use App\Supervision\Values\AskReference;

final readonly class CurrentAskAdmission implements AskAdmission
{
    public function __construct(
        private CurrentActor $actors,
        private AskRecords $asks,
        private AssignmentStorage $assignments,
        private AskTypeRegistry $types,
        private CommandRegistry $commands,
        private OperationPolicy $policy,
    ) {}

    public function requireCurrent(AskReference $ask, OperationKey $operation, int $expectedVersion): AdmittedAsk
    {
        $record = $this->asks->lock($ask);
        $actor = ActorIdentity::of($this->actors->actor());
        $holder = AssigneeIdentity::ofActorIdentity($actor);
        $assignment = $this->assignments->lockCurrent($record->assignmentIdentity());

        if (! $record->open || $record->version !== $expectedVersion
            || $assignment->isEmpty() || ! $assignment->get()->holder()->isSameAs($holder)) {
            throw AskRefused::routeChanged();
        }

        $type = $this->types->get($record->typeKey());
        if ($type->operation()->key !== $operation->key) {
            throw AskRefused::wrongOperation();
        }

        $declaration = $this->commands->operationNamed($operation->key)->getOrThrow(AskRefused::wrongOperation());

        $decision = $this->policy->assess(
            Operation::journal($declaration->name, $declaration->area, $declaration->accessTypes),
        );

        if (! $decision->allowed) {
            throw AskRefused::operationDenied($decision->reason);
        }

        return new AdmittedAsk($ask, $actor, $record->workReference(), $record->version, $record->head);
    }
}
