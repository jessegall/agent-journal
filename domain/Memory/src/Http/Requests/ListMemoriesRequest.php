<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Which page of the caller's own memories to read.
 */
final class ListMemoriesRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'page' => ['sometimes', 'integer', 'min:1'],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function page(): int
    {
        return $this->integer('page', 1);
    }
}
