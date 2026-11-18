<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Agents\Support\ModelSelection;
use App\Profiles\Commands\LaunchProfileMain;
use App\Profiles\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A main launch from the profile in the route: the request id that makes a repeat find the same launch, the main
 * agent, the model (a name or default) and, optionally, the program. Who launches comes from the request's actor.
 */
final class LaunchProfileMainRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'agentId' => ['required', 'ulid'],
            'model' => ['required', 'string', 'max:100'],
            'program' => ['nullable', 'string', 'max:32'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(): LaunchProfileMain
    {
        return new LaunchProfileMain(
            $this->string('requestId')->lower()->toString(),
            $this->string('agentId')->lower()->toString(),
            ProfileKey::from((string) $this->route('profile')),
            ModelSelection::fromInput($this->string('model')->toString()),
            $this->filled('program') ? $this->string('program')->toString() : null,
        );
    }
}
