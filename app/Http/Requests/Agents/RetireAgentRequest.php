<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Which agent to retire; who retires it comes from the request's actor alone.
 */
final class RetireAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'agentId' => ['required', 'ulid'],
            'session' => ['prohibited'],
            'session_id' => ['prohibited'],
            'actor' => ['prohibited'],
        ];
    }

    public function agentId(): string
    {
        return $this->string('agentId')->lower()->toString();
    }
}
