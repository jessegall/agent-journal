<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use App\Agents\Drivers\Enums\HoldReason;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The owner's release of the hold they read on the runtime of the session the route names: why, the agent and the hold.
 */
final class HoldReleaseRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'reason' => [
                'required',
                'string',
                'max:500',
                'regex:/\S/',
            ],
            'agentId' => [
                'required',
                'string',
            ],
            'hold' => [
                'required',
                Rule::enum(HoldReason::class),
            ],
        ];
    }

    public function sessionId(): string
    {
        return (string) $this->route('session');
    }

    public function agentId(): string
    {
        return $this->string('agentId')->toString();
    }

    public function hold(): HoldReason
    {
        return $this->enum('hold', HoldReason::class);
    }

    public function reason(): string
    {
        return trim($this->string('reason')->toString());
    }
}
