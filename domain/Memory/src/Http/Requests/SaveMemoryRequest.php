<?php

declare(strict_types=1);

namespace Domain\Memory\Http\Requests;

use Domain\Memory\Commands\SaveMemory;
use Domain\Memory\Models\Memory;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A new memory's text and weight. Whose memory it is comes from the signed credential alone, so a body naming an
 * agent, a session or an actor is refused.
 */
final class SaveMemoryRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'text' => ['required', 'string'],
            'weight' => ['required', 'integer', 'min:'.Memory::LIGHTEST, 'max:'.Memory::HEAVIEST],
            'agent' => ['prohibited'],
            'agent_id' => ['prohibited'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(): SaveMemory
    {
        return new SaveMemory($this->string('text')->value(), $this->integer('weight'));
    }
}
