<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\StopAgent;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A stop of the agent's session the caller saw, at the process generation it saw, sent once under its request id;
 * the agent comes from the route.
 */
final class StopAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'sessionId' => ['required', 'ulid'],
            'generation' => ['required', 'integer', 'min:0'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(string $agentId): StopAgent
    {
        return new StopAgent(
            $agentId,
            $this->string('sessionId')->lower()->toString(),
            $this->string('requestId')->lower()->toString(),
            $this->integer('generation'),
        );
    }
}
