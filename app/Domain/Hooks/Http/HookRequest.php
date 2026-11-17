<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Http;

use App\Domain\Hooks\Programs\HookPayload;
use App\Domain\Hooks\Programs\HookProgram;
use Illuminate\Foundation\Http\FormRequest;

/**
 * One hook call from an authenticated agent: the program in the address and the native payload in the body.
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
            'reason' => ['sometimes', 'string'],
            'stop_hook_active' => ['sometimes', 'boolean'],
        ];
    }

    public function program(): HookProgram
    {
        return HookProgram::from((string) $this->route('program'));
    }

    public function payload(): HookPayload
    {
        return HookPayload::from($this->validated());
    }
}
