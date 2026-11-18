<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Requests\Concerns;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\RecordIdentity;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\Plan;
use Illuminate\Validation\Rule;

/**
 * The inputs of a plan or phase cascade: the root by type and id, the recipient by type and id, and the assignment the
 * root is expected to have now. Who calls comes from the signed credential alone.
 */
trait ReadsPlanWorkInput
{
    /**
     * @return array<string, list<mixed>>
     */
    protected function rootRules(): array
    {
        return [
            'rootType' => ['required', Rule::in([Plan::LINK_TYPE, Phase::LINK_TYPE])],
            'rootId' => ['required', 'integer', 'min:1'],
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
        return ['recipientType' => ['required', Rule::enum(ActorType::class)], 'recipientId' => ['required', 'integer', 'min:1']];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function expectedRootRules(): array
    {
        return [
            'assignmentId' => ['required', 'integer', 'min:1'],
            'holderType' => ['required', Rule::enum(ActorType::class)],
            'holderId' => ['required', 'integer', 'min:1'],
        ];
    }

    public function rootRecord(): RecordIdentity
    {
        return new RecordIdentity($this->string('rootType')->toString(), $this->integer('rootId'));
    }

    public function recipient(): ActorIdentity
    {
        return new ActorIdentity(ActorType::from($this->string('recipientType')->toString()), $this->integer('recipientId'));
    }

    public function expectedRoot(): AssignmentReference
    {
        return new AssignmentReference(
            $this->integer('assignmentId'),
            new ActorIdentity(ActorType::from($this->string('holderType')->toString()), $this->integer('holderId')),
        );
    }
}
