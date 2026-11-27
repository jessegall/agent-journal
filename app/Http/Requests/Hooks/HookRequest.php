<?php

declare(strict_types=1);

namespace App\Http\Requests\Hooks;

use App\Agents\Drivers\Hooks\HookPayload;
use App\Hooks\TextOrArrayRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One hook call from an authenticated agent: the driver in the address and the native payload in the body.
 */
final class HookRequest extends FormRequest
{
    /**
     * @return array<string, list<string|ValidationRule>>
     */
    public function rules(): array
    {
        return [
            'hook_event_name' => [
                'required',
                'string',
            ],
            'session_id' => [
                'required',
                'string',
            ],
            'tool_name' => [
                'sometimes',
                'string',
            ],
            'tool_input' => [
                'sometimes',
                'array',
            ],
            // Claude Code sends the tool's response as an object, Codex as the text the tool printed.
            'tool_response' => [
                'sometimes',
                new TextOrArrayRule(),
            ],
            'prompt' => [
                'sometimes',
                'string',
            ],
            'source' => [
                'sometimes',
                'string',
            ],
            'transcript_path' => [
                'sometimes',
                'string',
                'max:1024',
            ],
            'cwd' => [
                'sometimes',
                'string',
                'max:1024',
            ],
            'reason' => [
                'sometimes',
                'string',
            ],
            'stop_hook_active' => [
                'sometimes',
                'boolean',
            ],
            'last_assistant_message' => [
                'sometimes',
                'nullable',
                'string',
            ],
            'agent_id' => [
                'sometimes',
                'string',
            ],
            'prompt_id' => [
                'sometimes',
                'string',
            ],
            'turn_id' => [
                'sometimes',
                'string',
            ],
            'error' => [
                'sometimes',
                'string',
                'max:80',
            ],
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
        if (! $this->has('generation')) {
            return null;
        }

        return $this->integer('generation');
    }

    public function payload(): HookPayload
    {
        return HookPayload::from($this->validated());
    }
}
