<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments\Concerns;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AutoAssignmentInput;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\PoolReference;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordReader;
use App\Records\Support\RecordIdentity;
use Illuminate\Validation\Rule;

/**
 * The inputs of an auto-assignment command: the actor and record type it is for, the pool with the records it lists
 * or the record it is about as people name them, such as task 3 or plan 12, the size and the revision the caller
 * read. Who calls comes from the request's actor alone.
 */
trait ReadsAutoAssignmentInput
{
    /**
     * @return array<string, list<mixed>>
     */
    protected function keyRules(): array
    {
        return [
            'actorType' => ['required', Rule::enum(ActorType::class)->only(ActorType::requestTypes())],
            'actorId' => ['required', 'ulid'],
            'assignableType' => ['required', 'string', 'max:100'],
            'agent' => ['prohibited'],
            'session' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function poolRules(): array
    {
        return [
            'pool' => ['required', 'string', 'max:100'],
            'records' => ['present', 'array', 'max:1000'],
            'records.*' => ['string', 'max:64'],
            'target' => ['nullable', 'string', 'max:64'],
            'size' => ['required', 'integer'],
        ];
    }

    /**
     * @return array<string, list<mixed>>
     */
    protected function revisionRules(): array
    {
        return ['expectedRevision' => ['required', 'integer', 'min:0']];
    }

    public function key(): AutoAssignmentKey
    {
        return new AutoAssignmentKey(
            new ActorIdentity(
                ActorType::from($this->string('actorType')->toString()),
                $this->string('actorId')->lower()->toString(),
            ),
            $this->string('assignableType')->toString(),
        );
    }

    /**
     * The input with every named record turned into its id; a name that reads as no record is refused here.
     */
    public function autoAssignmentInput(RecordReader $records): AutoAssignmentInput
    {
        $ids = array_map(
            fn (string $name) => $records->identify(RecordReference::parse($name))->id,
            array_values(array_map(strval(...), $this->array('records'))),
        );

        return new AutoAssignmentInput(
            $this->key(),
            new PoolReference($this->string('pool')->toString(), $this->target($records), $ids),
            $this->integer('size'),
        );
    }

    public function expectedRevision(): int
    {
        return $this->integer('expectedRevision');
    }

    /**
     * The record the pool is about, when the call names one.
     */
    private function target(RecordReader $records): RecordIdentity|null
    {
        if (! $this->filled('target')) {
            return null;
        }

        return $records->identify(RecordReference::parse($this->string('target')->toString()));
    }
}
