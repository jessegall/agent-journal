<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Commands\InterruptAgent\InterruptAgentCommand;
use Illuminate\Foundation\Http\FormRequest;

/**
 * An interrupt of the turn the agent's session runs, sent once under its request id; the agent comes from the route.
 */
final class InterruptAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'sessionId' => ['required', 'ulid'],
            'actor' => ['prohibited'],
        ];
    }

    public function command(string $agentId): InterruptAgentCommand
    {
        return new InterruptAgentCommand(
            $agentId,
            $this->string('sessionId')->lower()->toString(),
            $this->string('requestId')->lower()->toString(),
        );
    }
}
