<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Agents\Values\AccessPolicy;
use App\Agents\Values\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Contracts\ScriptCompilation;
use App\Profiles\Exceptions\InvalidScript;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\NamedCommand;
use App\Profiles\Values\ScriptSource;
use App\Scripts\Contracts\ScriptChecks;
use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;
use App\Scripts\Values\BooleanOperand;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\KeywordDefinition;
use App\Scripts\Values\ScriptRange;

final readonly class ProfileScriptCompiler implements ScriptCompilation
{
    public function __construct(
        private ScriptChecks $checks,
        private KeywordRegistry $keywords,
        private ObjectRegistry $objects,
    ) {}

    public function compile(ScriptSource $source): CompiledScript
    {
        $check = $this->checks->check($source);

        if ($check->compiled === null) {
            throw InvalidScript::withDiagnostics($check->diagnostics);
        }

        return $check->compiled;
    }

    public function compileForProfile(ScriptSource $source, AccessPolicy $access): CompiledScript
    {
        $compiled = $this->compile($source);

        /**
         * @var array<string, Instruction> $instructions
         */
        $instructions = $compiled->graph['instructions'];

        foreach ($instructions as $instruction) {
            foreach ($this->operations($instruction->keyword, $instruction->operand) as $operation) {
                $this->assertAllowed($access, $instruction->source, $operation);
            }
        }

        return $compiled;
    }

    /**
     * @return list<Operation>
     */
    private function operations(string $token, object $operand): array
    {
        if ($operand instanceof NamedCommand) {
            $name = 'profile.command:'.$operand->key;

            return [Operation::journal($name, ResourceAreaType::Workspace, $operand->effects)];
        }

        if ($operand instanceof BooleanOperand) {
            $member = $this->objects->get($operand->object)->members[$operand->member];

            return [Operation::journal($member->read->key, ResourceAreaType::Workspace, [AccessType::Read])];
        }

        $definition = $this->keywords->get($token)->definition;

        if (! $definition instanceof KeywordDefinition) {
            return [];
        }

        $operations = [];
        foreach ($definition->effects as $effect) {
            $operations[] = Operation::journal(
                $effect->operation()->key,
                ResourceAreaType::JournalWork,
                [AccessType::Create],
            );
        }

        return $operations;
    }

    private function assertAllowed(AccessPolicy $access, ScriptRange $range, Operation $operation): void
    {
        $decision = $access->decide($operation);

        if (! $decision->allowed) {
            $failure = ScriptSyntaxError::at(DiagnosticCode::CommandNotAllowed, $range, $decision->reason);

            throw InvalidScript::withDiagnostics([$failure->diagnostic]);
        }
    }
}
