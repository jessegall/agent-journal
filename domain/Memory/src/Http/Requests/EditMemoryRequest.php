<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Requests;

use Domain\Memory\Commands\EditMemory;
use Domain\Memory\Models\Memory;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One of the caller's memories and its new text, weight or both.
 */
final class EditMemoryRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'memory_id' => ['required', 'string', 'ulid'],
            'text' => ['nullable', 'string'],
            'weight' => ['nullable', 'integer', 'min:'.Memory::LIGHTEST, 'max:'.Memory::HEAVIEST],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): EditMemory
    {
        return new EditMemory(
            $this->string('memory_id')->value(),
            $this->filled('text') ? $this->string('text')->value() : null,
            $this->filled('weight') ? $this->integer('weight') : null,
        );
    }
}
