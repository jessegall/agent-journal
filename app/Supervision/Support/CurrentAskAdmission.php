<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentStorage;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\Command;
use App\Profiles\Support\CommandAdmissions;
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
        private CommandAdmissions $admissions,
    ) {}

    /**
     * @param  class-string<Command<mixed>>  $command  the command the answer runs, which the ask's type must require
     */
    public function requireCurrent(AskReference $ask, string $command, int $expectedVersion): AdmittedAsk
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

        if ($type->requiredCommand() !== $command) {
            throw AskRefused::wrongOperation();
        }

        $decision = $this->admissions->admits($command);

        if (! $decision->allowed) {
            throw AskRefused::operationDenied($decision->reason);
        }

        return new AdmittedAsk($ask, $actor, $record->workReference(), $record->version, $record->head);
    }
}
