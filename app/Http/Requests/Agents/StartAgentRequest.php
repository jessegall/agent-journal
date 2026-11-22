<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\StartAgent\StartAgentCommand;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Values\ModelSelection;
use App\Agents\Values\SelectedDriver;
use App\Agents\Values\StartPolicy;
use App\Agents\Values\StartRequest;
use App\Drivers\Contracts\DriverCatalogue;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A user starts a main agent with a driver and a model named outright: no profile chooses either, so leaving
 * one out, or asking for the default model, is refused before any session exists.
 */
final class StartAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'driver' => ['nullable', 'string', 'max:32'],
            'model' => ['nullable', 'string', 'max:100'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(DriverCatalogue $drivers): StartAgentCommand
    {
        $selection = SelectedDriver::resolve(
            $this->filled('driver') ? $this->string('driver')->toString() : null,
            ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : null),
            null,
            null,
            $drivers,
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
        ));
    }
}
