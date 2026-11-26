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
 * The command line of codex-cli 0.165.0 in a terminal: a resume only by the conversation Codex acknowledged, the
 * sandbox, no approval asked, the model and effort, every agent feature off.
 *
 * @extends ArgumentBuilder<DriverStart>
 */
final readonly class CodexArguments extends ArgumentBuilder
{
    public const string EXECUTABLE = 'codex';

    private const string SANDBOX = 'workspace-write';

    protected function arguments(): array
    {
        return [
            Argument::for(new AnyContext(), self::EXECUTABLE),
            Argument::for(new ResumedTerminal(), fn (DriverStart $start) => [
                'resume',
                $start->sessionId,
            ]),
            Argument::for(new AnyContext(), ['--sandbox', self::SANDBOX]),
            // The journal's hook decides each call.
            Argument::for(new AnyContext(), ['--ask-for-approval', 'never']),
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
