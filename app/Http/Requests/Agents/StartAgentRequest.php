<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Agents\Drivers\Enums\DriverType;
use App\Agents\Enums\ConversationModeType;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\BuiltInStartProfiles;
use App\Sessions\Enums\StartOriginType;
use App\Sessions\StartPreviews;
use App\Sessions\Values\StartPolicy;
use App\Values\ModelSelection;
use App\Values\SelectedDriver;
use App\Values\StartRequest;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * A user starts a main agent with a driver and a model named outright: no profile chooses either, so leaving
 * one out, or asking for the default model, is refused before any session exists.
 */
final class StartAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<mixed>>
     */
    public function rules(): array
    {
        return [
            'requestId' => [
                'required',
                'ulid',
            ],
            'driver' => [
                'nullable',
                'string',
                'max:32',
            ],
            'model' => [
                'nullable',
                'string',
                'max:100',
            ],
            'effort' => [
                'nullable',
                'string',
                'max:32',
            ],
            'driverType' => [
                'nullable',
                Rule::enum(DriverType::class),
            ],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(
        DriverCatalogue $drivers,
        BuiltInStartProfiles $profiles,
        StartPreviews $previews,
    ): StartAgentCommand {
        $agent = Agent::query()->findOrFail(strtolower((string) $this->route('agent')));

        $selection = SelectedDriver::resolve(
            $this->filled('driver') ? $this->string('driver')->toString() : null,
            ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : null),
            $this->filled('effort') ? $this->string('effort')->toString() : null,
            null,
            null,
            $drivers,
        );

        [$driverType] = $previews->chosenDriverType(
            $agent,
            $selection->driver,
            $this->enum('driverType', DriverType::class),
            $profiles->defaultDriverTypeOf($agent->profile_key),
        );

        return new StartAgentCommand(new StartRequest(
            $this->string('requestId')->lower()->toString(),
            strtolower((string) $this->route('agent')),
            $selection,
            StartOriginType::MainStart,
            null,
            null,
            ConversationModeType::New,
            null,
            StartPolicy::mainOnHost(base_path()),
            $driverType,
        ));
    }
}
