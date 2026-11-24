<?php

declare(strict_types=1);

namespace App\Http\Requests\Web;

use Illuminate\Foundation\Http\FormRequest;

/**
 * The owner's recovery of one driver request the route names: why, the row version they read, and for an uncertain
 * delivery whether it arrived.
 */
final class RequestRecoveryRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'reason' => ['required', 'string', 'max:500', 'regex:/\S/'],
            'rowVersion' => ['required', 'integer', 'min:0'],
            'applied' => ['sometimes', 'boolean'],
            'confirmsPossibleDuplicate' => ['sometimes', 'boolean'],
        ];
    }

    public function requestId(): string
    {
        return (string) $this->route('driver_request');
    }

    public function reason(): string
    {
        return trim($this->string('reason')->toString());
    }

    public function rowVersion(): int
    {
        return $this->integer('rowVersion');
    }

    /**
     * Whether the owner confirmed that sending an uncertain delivery again may deliver it twice.
     */
    public function confirmsPossibleDuplicate(): bool
    {
        return $this->boolean('confirmsPossibleDuplicate');
    }

    public function isApplied(): bool
    {
        return $this->boolean('applied');
    }
}
