<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Enums\CodexAgentFeature;
use App\Agents\Drivers\StartConditions\ResumedTerminal;
use App\Processes\AnyContext;
use App\Processes\Argument;
use App\Processes\ArgumentBuilder;
use App\Values\DriverStart;

/**
 * The command line of codex-cli 0.165.0 in a terminal: a resume only by the conversation Codex acknowledged, the one
 * flag that skips every approval and sandbox, the model and effort, every agent feature off.
 *
 * @extends ArgumentBuilder<DriverStart>
 */
final readonly class CodexArguments extends ArgumentBuilder
{
    public const string EXECUTABLE = 'codex';

    /**
     * Codex's own sandbox setting for running with it off, as the app-server's threads name it: the journal's
     * container is the only boundary.
     */
    public const string NO_SANDBOX = 'danger-full-access';

    protected function arguments(): array
    {
        return [
            Argument::for(new AnyContext(), self::EXECUTABLE),
            Argument::for(new ResumedTerminal(), fn (DriverStart $start) => [
                'resume',
                $start->sessionId,
            ]),
            // The journal's hook decides each call, and the container is the only boundary.
            Argument::for(new AnyContext(), '--dangerously-bypass-approvals-and-sandbox'),
            Argument::option(['-m', '{value}'], fn (DriverStart $start) => $start->model),
            Argument::option(['-c', 'model_reasoning_effort={value}'], fn (DriverStart $start) => $start->effort),
            Argument::for(new AnyContext(), $this->featuresOff()),
            Argument::option(['{value}'], fn (DriverStart $start) => $start->prompt),
        ];
    }

    /**
     * @return list<string>
     */
    private function featuresOff(): array
    {
        return array_merge(...array_map(
            fn (CodexAgentFeature $feature) => [
                '-c',
                "features.{$feature->value}=false",
            ],
            CodexAgentFeature::cases(),
        ));
    }
}
