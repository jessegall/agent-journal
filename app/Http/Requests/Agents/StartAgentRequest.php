<?php

declare(strict_types=1);

namespace App\Http\Requests\Agents;

use App\Agents\Commands\StartAgent;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\StartOriginType;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Agents\Support\StartPolicy;
use App\Agents\Support\StartRequest;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A user starts a main agent with a program and a model named outright: no profile chooses either, so leaving
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
            'program' => ['nullable', 'string', 'max:32'],
            'model' => ['nullable', 'string', 'max:100'],
            'actor' => ['prohibited'],
            'session' => ['prohibited'],
        ];
    }

    public function command(): StartAgent
    {
        $selection = SelectedProgram::resolve(
            $this->filled('program') ? $this->string('program')->toString() : null,
            ModelSelection::fromInput($this->filled('model') ? $this->string('model')->toString() : null),
            null,
            null,
        );

        return new StartAgent(new StartRequest(
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
