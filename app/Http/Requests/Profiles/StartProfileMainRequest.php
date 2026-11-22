<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Agents\Enums\DriverVariant;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\ModelSelection;
use App\Profiles\Commands\StartProfileMain\StartProfileMainCommand;
use App\Profiles\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

/**
 * A main start from the profile in the route: the request id that makes a repeat find the same start, the main
 * agent, the model (a name or default) and, optionally, the driver, variant and chosen account. Who starts comes from the request's actor.
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
            'variant' => ['nullable', Rule::enum(DriverVariant::class)],
            'saveVariant' => ['boolean'],
            'accountId' => ['nullable', 'ulid', 'required_with:accountRevision'],
            'accountRevision' => ['nullable', 'integer', 'min:0', 'required_with:accountId'],
            'conversationId' => ['nullable', 'ulid'],
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
            $this->enum('variant', DriverVariant::class),
            $this->boolean('saveVariant'),
            $this->filled('accountId')
                ? new ChosenAccount($this->string('accountId')->lower()->toString(), $this->integer('accountRevision'))
                : null,
            $this->filled('conversationId') ? $this->string('conversationId')->lower()->toString() : null,
        );
    }
}
