<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\StartConditions\ResumedTerminal;
use App\Agents\Drivers\StartConditions\ResumedTurn;
use App\Agents\Drivers\StartConditions\TurnStart;
use App\Enums\Drivers\CodexAgentFeature;
use App\Support\CommandLines\AnyContext;
use App\Support\CommandLines\Argument;
use App\Support\CommandLines\ArgumentBuilder;
use App\Values\DriverStart;

/**
 * The command line of codex-cli 0.165.0: exec for a turn, a resume only by the conversation Codex acknowledged, the
 * sandbox, no approval asked in the terminal, the model and effort, JSON events for a turn, every agent feature off.
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
            Argument::for(new TurnStart(), 'exec'),
            // codex exec resume takes none of exec's options, so a turn names its thread after them.
            Argument::for(new ResumedTerminal(), fn (DriverStart $start) => [
                'resume',
                $start->sessionId,
            ]),
            Argument::for(new AnyContext(), ['--sandbox', self::SANDBOX]),
            // In the terminal the journal's hook decides each call; a turn never asks.
            Argument::unless(new TurnStart(), ['--ask-for-approval', 'never']),
            Argument::option(['-m', '{value}'], fn (DriverStart $start) => $start->model),
            Argument::option(['-c', 'model_reasoning_effort={value}'], fn (DriverStart $start) => $start->effort),
            Argument::for(new TurnStart(), ['--json', '--skip-git-repo-check']),
            Argument::for(new AnyContext(), $this->featuresOff()),
            Argument::for(new ResumedTurn(), fn (DriverStart $start) => [
                'resume',
                $start->sessionId,
            ]),
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
