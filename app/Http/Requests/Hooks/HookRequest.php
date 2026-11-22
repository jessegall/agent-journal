<?php

declare(strict_types=1);

namespace App\Http\Requests\Hooks;

use App\Support\Drivers\HookPayload;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One hook call from an authenticated agent: the driver in the address and the native payload in the body.
 */
final class HookRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'hook_event_name' => ['required', 'string'],
            'session_id' => ['required', 'string'],
            'tool_name' => ['sometimes', 'string'],
            'tool_input' => ['sometimes', 'array'],
            'tool_response' => ['sometimes', 'array'],
            'prompt' => ['sometimes', 'string'],
            'source' => ['sometimes', 'string'],
            'transcript_path' => ['sometimes', 'string', 'max:1024'],
            'cwd' => ['sometimes', 'string', 'max:1024'],
            'reason' => ['sometimes', 'string'],
            'stop_hook_active' => ['sometimes', 'boolean'],
            'agent_id' => ['sometimes', 'string'],
            'prompt_id' => ['sometimes', 'string'],
            'turn_id' => ['sometimes', 'string'],
            'error' => ['sometimes', 'string', 'max:80'],
        ];
    }

    public function driver(): string
    {
        return (string) $this->route('driver');
    }

    /**
     * The process generation the relay sent, or null for a driver the host did not start.
     */
    public function processGeneration(): int|null
    {
        return $this->query('generation') === null ? null : $this->integer('generation');
    }

    public function payload(): HookPayload
    {
        return HookPayload::from($this->validated());
    }
}
