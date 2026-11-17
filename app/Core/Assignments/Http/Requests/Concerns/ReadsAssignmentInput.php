<?php

declare(strict_types=1);

namespace App\Core\Assignments\Http\Requests\Concerns;

use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\RecordIdentity;
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
            'recordType' => ['required', 'string', 'max:100'],
            'recordId' => ['required', 'integer', 'min:1'],
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
    protected function recipientRules(): array
    {
        return [
            'recipientType' => ['required', Rule::enum(ActorType::class)],
            'recipientId' => ['required', 'integer', 'min:1'],
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function expectedRules(): array
    {
        return [
            'assignmentId' => ['required', 'integer', 'min:1'],
            'holderType' => ['required', Rule::enum(ActorType::class)],
            'holderId' => ['required', 'integer', 'min:1'],
        ];
    }

    public function record(): RecordIdentity
    {
        return new RecordIdentity($this->string('recordType')->toString(), $this->integer('recordId'));
    }

    public function recipient(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->string('recipientType')->toString()), $this->integer('recipientId'));
    }

    public function expected(): AssignmentReference
    {
        return new AssignmentReference(
            $this->integer('assignmentId'),
            new ActorIdentity(ActorType::from($this->string('holderType')->toString()), $this->integer('holderId')),
        );
    }
}
