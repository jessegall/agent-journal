<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Commands\Agents\StartProfileMain\StartProfileMainCommand;
use App\Enums\Drivers\DriverType;
use App\Values\ChosenAccount;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * A main start from the profile in the route: the request id that makes a repeat find the same start, the main
 * agent, the model (a name or default) and, optionally, the driver, driver type and chosen account. Who starts comes from the request's actor.
 */
final class StartProfileMainRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'agentId' => ['required', 'ulid'],
            'model' => ['required', 'string', 'max:100'],
            'driver' => ['nullable', 'string', 'max:32'],
            'driverType' => ['nullable', Rule::enum(DriverType::class)],
            'saveDriverType' => ['boolean'],
            'accountId' => ['nullable', 'ulid', 'required_with:accountRevision'],
            'accountRevision' => ['nullable', 'integer', 'min:0', 'required_with:accountId'],
            'conversationId' => ['nullable', 'ulid'],
            'previewRevision' => ['nullable', 'integer', 'min:0'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(): StartProfileMainCommand
    {
        return new StartProfileMainCommand(
            $this->string('requestId')->lower()->toString(),
            $this->string('agentId')->lower()->toString(),
            ProfileKey::from((string) $this->route('profile')),
            ModelSelection::fromInput($this->string('model')->toString()),
            $this->filled('driver') ? $this->string('driver')->toString() : null,
            $this->enum('driverType', DriverType::class),
            $this->boolean('saveDriverType'),
            $this->filled('accountId')
                ? new ChosenAccount($this->string('accountId')->lower()->toString(), $this->integer('accountRevision'))
                : null,
            $this->filled('conversationId') ? $this->string('conversationId')->lower()->toString() : null,
            $this->filled('previewRevision') ? $this->integer('previewRevision') : null,
        );
    }
}
