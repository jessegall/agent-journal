<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Admission\AskAdmission;
use App\Contracts\Assignments\AssignmentStorage;
use App\Contracts\Bus\Command;
use App\Exceptions\AskRefused;
use App\Values\AdmittedAsk;
use App\Values\AskReference;

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
            throw AskRefused::operationDenied($decision->reason->text);
        }

        return new AdmittedAsk($ask, $actor, $record->workReference(), $record->version, $record->head);
    }
}
