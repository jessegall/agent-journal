<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The key a cancellation of a start is sent under once; the agent and its session come from the route.
 */
final class CancelSessionStartRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'actor' => ['prohibited'],
        ];
    }

    public function requestId(): string
    {
        return $this->string('requestId')->lower()->toString();
    }
}
