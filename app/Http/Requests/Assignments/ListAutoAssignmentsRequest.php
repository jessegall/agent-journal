<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Contracts\Actors\ActorTypes;
use App\Support\ActorReference;
use App\Support\IdListPage;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Whose auto-assignments to list, and the id the page starts after.
 */
final class ListAutoAssignmentsRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(ActorTypes $actorTypes): array
    {
        return [
            'actorType' => ['required', Rule::in($actorTypes->requestTypes())],
            'actorId' => ['required', 'ulid'],
            'after' => ['nullable', 'ulid'],
        ];
    }

    public function actor(): ActorReference
    {
        return ActorReference::fromStored(
            $this->string('actorType')->toString(),
            $this->string('actorId')->lower()->toString(),
        );
    }

    public function page(): IdListPage
    {
        return new IdListPage($this->filled('after') ? $this->string('after')->lower()->toString() : null);
    }
}
