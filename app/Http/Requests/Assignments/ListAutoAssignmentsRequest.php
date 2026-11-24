<?php

declare(strict_types=1);

namespace App\Http\Requests\Assignments;

use App\Enums\ActorType;
use App\Support\ActorIdentity;
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
    public function rules(): array
    {
        return [
            'actorType' => ['required', Rule::enum(ActorType::class)->only(ActorType::requestTypes())],
            'actorId' => ['required', 'ulid'],
            'after' => ['nullable', 'ulid'],
        ];
    }

    public function actor(): ActorIdentity
    {
        return new ActorIdentity(
            ActorType::from($this->string('actorType')->toString()),
            $this->string('actorId')->lower()->toString(),
        );
    }

    public function page(): IdListPage
    {
        return new IdListPage($this->filled('after') ? $this->string('after')->lower()->toString() : null);
    }
}
