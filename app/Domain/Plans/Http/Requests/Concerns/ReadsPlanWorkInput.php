<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Requests\Concerns;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\RecordIdentity;
use App\Domain\Plans\Models\Phase;
use App\Domain\Plans\Models\Plan;
use Illuminate\Validation\Rule;

/**
 * The inputs of a plan or phase cascade: the root by type and id, the recipient by kind and id, and the assignment the
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
        return ['recipientKind' => ['required', Rule::enum(ActorKind::class)], 'recipientId' => ['required', 'integer', 'min:1']];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function expectedRootRules(): array
    {
        return [
            'assignmentId' => ['required', 'integer', 'min:1'],
            'holderKind' => ['required', Rule::enum(ActorKind::class)],
            'holderId' => ['required', 'integer', 'min:1'],
        ];
    }

    public function rootRecord(): RecordIdentity
    {
        return new RecordIdentity($this->string('rootType')->toString(), $this->integer('rootId'));
    }

    public function recipient(): ActorIdentity
    {
        return new ActorIdentity(ActorKind::from($this->string('recipientKind')->toString()), $this->integer('recipientId'));
    }

    public function expectedRoot(): AssignmentReference
    {
        return new AssignmentReference(
            $this->integer('assignmentId'),
            new ActorIdentity(ActorKind::from($this->string('holderKind')->toString()), $this->integer('holderId')),
        );
    }
}
