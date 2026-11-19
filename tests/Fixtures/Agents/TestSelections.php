<?php

declare(strict_types=1);

namespace Tests\Fixtures\Agents;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\ModelSelection;
use App\Agents\Support\SelectedProgram;
use App\Programs\Enums\HookProgram;
use Illuminate\Support\Str;

/**
 * The program and model a test launch names, and a fresh launch request id for it.
 */
final class TestSelections
{
    public const string MODEL = 'claude-opus-5-5';

    public static function of(string $program = 'claude-code'): SelectedProgram
    {
        return SelectedProgram::resolve($program, ModelSelection::named(self::MODEL), null, null);
    }

    public static function requestId(): string
    {
        return (string) Str::ulid();
    }

    /**
     * The selection columns of a session row a test writes by hand.
     *
     * @return array<string, string|int>
     */
    public static function sessionColumns(HookProgram $program = HookProgram::ClaudeCode): array
    {
        return [
            'program' => $program->value,
            'model' => self::MODEL,
            'requested_model_type' => 'named',
            'requested_model' => self::MODEL,
            'program_source' => 'explicit',
            'profile_key' => 'main-agent',
            'profile_revision' => 1,
            'launch_request_id' => self::requestId(),
        ];
    }

    /**
     * A launch on the protected host, as a main agent runs.
     */
    public static function onHost(): ExecutionPolicy
    {
        return ExecutionPolicy::make(
ExecutionModeType::ProtectedHost,
 null,
 '/workspaces/test',
 ExecutionBudgets::defaults(),
 [],
);
    }
}
