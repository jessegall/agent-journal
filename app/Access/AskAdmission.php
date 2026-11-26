<?php

declare(strict_types=1);

namespace App\Access;

use App\Access\Contracts\AskAdmission as AskAdmissionContract;
use App\Access\Values\AdmittedAsk;
use App\Actors\Contracts\AgentTexts;
use App\Actors\Contracts\CurrentActor;
use App\Asks\AskRecords;
use App\Asks\AskTypeRegistry;
use App\Asks\Exceptions\AskRefused;
use App\Assignments\Contracts\AssignmentStorage;
use App\Bus\Contracts\Command;
use App\Support\AssigneeIdentity;
use App\Values\AskReference;

final readonly class AskAdmission implements AskAdmissionContract
{
    public function __construct(
        private CurrentActor $actors,
        private AskRecords $asks,
        private AssignmentStorage $assignments,
        private AskTypeRegistry $types,
        private CommandAdmissions $admissions,
        private AgentTexts $texts,
    ) {}

    /**
     * @param  class-string<Command<mixed>>  $command  the command the answer runs, which the ask's type must require
     */
    public function requireCurrent(AskReference $ask, string $command, int $expectedVersion): AdmittedAsk
    {
        $record = $this->asks->lock($ask);
        $actor = $this->actors->actor();
        $holder = AssigneeIdentity::ofActorReference($actor);
        $assignment = $this->assignments->lockCurrent($record->assignmentIdentity());

        if (! $record->open || $record->version !== $expectedVersion
            || $assignment->isEmpty() || ! $assignment->get()->holder()->isSameAs($holder)) {
            throw AskRefused::routeChanged();
        }

        $type = $this->types->get($record->type_key);

        if ($type->requiredCommand() !== $command) {
            throw AskRefused::wrongOperation();
        }

        $decision = $this->admissions->admits($command);

        if (! $decision->isAllowed) {
            throw AskRefused::operationDenied($this->texts->render($decision->reason));
        }

        return new AdmittedAsk($ask, $actor, $record->workReference, $record->version, $record->head);
    }
}
