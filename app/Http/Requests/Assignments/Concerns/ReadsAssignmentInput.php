<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments\Concerns;

use App\Actors\Contracts\ActorTypes;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;
use Illuminate\Validation\Rule;

/**
 * The inputs of a single-record assignment command: the record by type and id, the recipient by type and id, and the
 * assignment a deliberate change expects by its row id and holder. Who calls comes from the request's actor alone, so
 * an input naming an agent, a session or an actor is refused.
 */
trait ReadsAssignmentInput
{
    /**
     * @return array<string, list<mixed>>
     */
    protected function recordRules(): array
    {
        return [
            'recordType' => [
                'required',
                'string',
                'max:100',
            ],
            'recordId' => [
                'required',
                'ulid',
            ],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function recipientRules(ActorTypes $actorTypes): array
    {
        return [
            'recipientType' => [
                'required',
                Rule::in($actorTypes->requestTypes()),
            ],
            'recipientId' => [
                'required',
                'ulid',
            ],
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function expectedRules(ActorTypes $actorTypes): array
    {
        return [
            'assignmentId' => [
                'required',
                'ulid',
            ],
            'holderType' => [
                'required',
                Rule::in($actorTypes->requestTypes()),
            ],
            'holderId' => [
                'required',
                'ulid',
            ],
        ];
    }

    public function record(): RecordIdentity
    {
        return new RecordIdentity(
            $this->string('recordType')->toString(),
            $this->string('recordId')->lower()->toString(),
        );
    }

    public function recipient(): AssigneeIdentity
    {
        return new AssigneeIdentity(
            $this->string('recipientType')->toString(),
            $this->string('recipientId')->lower()->toString(),
        );
    }

    public function expected(): AssignmentReference
    {
        return new AssignmentReference(
            $this->string('assignmentId')->lower()->toString(),
            new AssigneeIdentity(
                $this->string('holderType')->toString(),
                $this->string('holderId')->lower()->toString(),
            ),
        );
    }
}
