<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\DismissLaunchOutcome;
use App\Agents\Enums\StartDisposition;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Which version of which start's outcome the viewer dismisses; the agent comes from the route.
 */
final class DismissLaunchOutcomeRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'version' => ['required', Rule::enum(StartDisposition::class)],
            'actor' => ['prohibited'],
        ];
    }

    public function command(string $agentId): DismissLaunchOutcome
    {
        return new DismissLaunchOutcome(
            $agentId,
            $this->string('requestId')->lower()->toString(),
            StartDisposition::from($this->string('version')->toString()),
        );
    }
}
