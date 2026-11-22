<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Agents\Enums\DriverVariant;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\DriverSwitchTarget;
use App\Agents\Values\ModelSelection;
use App\Drivers\Contracts\DriverCatalogue;
use App\Profiles\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Profiles\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\In;

/**
 * A switch of an agent of the profile in the route to another driver, variant or account: the session and process
 * generation the owner saw, so a stale tab is refused, and the request id that makes a repeat find the same switch.
 */
final class SwitchAgentDriverRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum|In>>
     */
    public function rules(DriverCatalogue $drivers): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'agentId' => ['required', 'ulid'],
            'expectedSessionId' => ['required', 'ulid'],
            'expectedGeneration' => ['required', 'integer', 'min:0'],
            'driver' => ['required', Rule::in($drivers->familyKeys())],
            'variant' => ['required', Rule::enum(DriverVariant::class)],
            'accountId' => ['required', 'ulid'],
            'accountRevision' => ['required', 'integer', 'min:0'],
            'conversationId' => ['nullable', 'ulid'],
            'saveVariant' => ['boolean'],
            'model' => ['required', 'string', 'max:100'],
        ];
    }

    public function command(): SwitchAgentDriverCommand
    {
        return new SwitchAgentDriverCommand(
            $this->string('requestId')->lower()->toString(),
            $this->string('agentId')->lower()->toString(),
            ProfileKey::from((string) $this->route('profile')),
            $this->string('expectedSessionId')->lower()->toString(),
            $this->integer('expectedGeneration'),
            $this->target(),
            ModelSelection::fromInput($this->string('model')->toString()),
        );
    }

    private function target(): DriverSwitchTarget
    {
        return new DriverSwitchTarget(
            $this->string('driver')->toString(),
            DriverVariant::from($this->string('variant')->toString()),
            new ChosenAccount($this->string('accountId')->lower()->toString(), $this->integer('accountRevision')),
            $this->filled('conversationId') ? $this->string('conversationId')->lower()->toString() : null,
            $this->boolean('saveVariant'),
        );
    }
}
