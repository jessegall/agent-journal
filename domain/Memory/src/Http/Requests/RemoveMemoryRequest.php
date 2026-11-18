<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Requests;

use Domain\Memory\Commands\RemoveMemory;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One of the caller's memories to remove.
 */
final class RemoveMemoryRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'memory_id' => ['required', 'string', 'ulid'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): RemoveMemory
    {
        return new RemoveMemory($this->string('memory_id')->value());
    }
}
