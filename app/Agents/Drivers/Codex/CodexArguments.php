<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Enums\CodexAgentFeature;
use App\Agents\Drivers\StartConditions\ResumedStart;
use App\Agents\Drivers\StartConditions\TurnStart;
use App\Processes\AnyContext;
use App\Processes\Argument;
use App\Processes\ArgumentBuilder;
use App\Values\DriverStart;

/**
 * The command line of Codex: a headless turn runs `codex exec --json` and a later turn resumes the thread the first
 * one started, a terminal resumes only the conversation Codex acknowledged; both with the one flag that skips every
 * approval and sandbox, the model and effort, every agent feature off.
 *
 * @extends ArgumentBuilder<DriverStart>
 */
final readonly class CodexArguments extends ArgumentBuilder
{
    public const string EXECUTABLE = 'codex';

    protected function arguments(): array
    {
        return [
            Argument::for(new AnyContext(), self::EXECUTABLE),
            Argument::for(new TurnStart(), 'exec'),
            Argument::for(new ResumedStart(), fn (DriverStart $start) => [
                'resume',
                $start->sessionId,
            ]),
            Argument::for(new TurnStart(), ['--json', '--skip-git-repo-check']),
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
