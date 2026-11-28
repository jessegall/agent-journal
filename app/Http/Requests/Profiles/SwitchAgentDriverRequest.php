<?php

declare(strict_types=1);

namespace App\Http\Requests\Profiles;

use App\Agents\Commands\ChooseNextStart\ChooseNextStartCommand;
use App\Agents\Commands\SwitchAgentDriver\SwitchAgentDriverCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverType;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Rules\In;

/**
 * Moves an agent to another driver, account or model, at the session the owner saw so a stale tab is refused, with
 * whether a new program's session reads the chat first and whether the turn stops now; without a session it keeps the
 * choice for the agent's next start.
 */
final class SwitchAgentDriverRequest extends FormRequest
{
    /**
     * @return array<string, list<string|Enum|In>>
     */
    public function rules(DriverCatalogue $drivers): array
    {
        return [
            'requestId' => [
                'required',
                'ulid',
            ],
            'agentId' => [
                'required',
                'ulid',
            ],
            'expectedSessionId' => [
                'nullable',
                'ulid',
            ],
            'expectedGeneration' => [
                'required_with:expectedSessionId',
                'integer',
                'min:0',
            ],
            'driver' => [
                'required',
                Rule::in($drivers->familyKeys()),
            ],
            'driverType' => [
                'required',
                Rule::enum(DriverType::class),
            ],
            'accountId' => [
                'required',
                'ulid',
            ],
            'accountRevision' => [
                'required',
                'integer',
                'min:0',
            ],
            'conversationId' => [
                'nullable',
                'ulid',
            ],
            'saveDriverType' => ['boolean'],
            'model' => [
                'required',
                'string',
                'max:100',
            ],
            'carryConversation' => ['boolean'],
            'stopsTurn' => ['boolean'],
        ];
    }

    /**
     * Whether the owner saw the agent run a session, which the switch then replaces.
     */
    public function replacesSession(): bool
    {
        return $this->filled('expectedSessionId');
    }

    public function nextStart(): ChooseNextStartCommand
    {
        return new ChooseNextStartCommand(
            $this->string('agentId')->lower()->toString(),
            $this->string('driver')->toString(),
            $this->string('model')->toString(),
            $this->account(),
        );
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
            $this->boolean('stopsTurn'),
        );
    }

    private function account(): ChosenAccount
    {
        return new ChosenAccount($this->string('accountId')->lower()->toString(), $this->integer('accountRevision'));
    }

    private function target(): DriverSwitchTarget
    {
        return new DriverSwitchTarget(
            $this->string('driver')->toString(),
            DriverType::from($this->string('driverType')->toString()),
            $this->account(),
            $this->filled('conversationId') ? $this->string('conversationId')->lower()->toString() : null,
            $this->boolean('saveDriverType'),
            $this->string('model')->toString(),
            $this->boolean('carryConversation'),
        );
    }
}
