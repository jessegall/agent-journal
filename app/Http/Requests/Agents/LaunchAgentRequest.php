<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A person launches a main agent with a program and a model named outright: no profile chooses either, so leaving
 * one out, or asking for the default model, is refused before any session exists.
 */
final class LaunchAgentRequest extends FormRequest
{
    /**
     * @return array<string, list<string>>
     */
    public function rules(): array
    {
        return [
            'requestId' => ['required', 'ulid'],
            'program' => ['nullable', 'string', 'max:32'],
            'model' => ['nullable', 'string', 'max:100'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(): LaunchAgent
    {
        $selection = SelectedProgram::resolve(
            $this->filled('program') ? $this->string('program')->toString() : null,
            ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : null),
            null,
            null,
        );

        return new LaunchAgent(new LaunchRequest(
            $this->string('requestId')->lower()->toString(),
            strtolower((string) $this->route('agent')),
            $selection,
            LaunchOriginType::MainLaunch,
            null,
            null,
            ConversationModeType::New,
            null,
            LaunchPolicy::mainOnHost(base_path()),
        ));
    }
}
