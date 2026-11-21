<?php

declare(strict_types=1);

namespace App\Scripts\Support;

use App\Actors\Contracts\ReadEntitlements;
use App\Actors\Enums\ReadEntitlementType;
use App\Agents\Values\Operation;
use App\Agents\Values\ResourceRequest;
use App\Operations\Enums\AccessType;
use App\Profiles\Contracts\ScriptCompilation;
use App\Profiles\Exceptions\InvalidScript;
use App\Profiles\Values\CompiledScript;
use App\Profiles\Values\NamedCommand;
use App\Profiles\Values\ProfileDefinition;
use App\Profiles\Values\ScriptSource;
use App\Scripts\Contracts\ScriptChecks;
use App\Scripts\Enums\DiagnosticCode;
use App\Scripts\Exceptions\ScriptSyntaxError;
use App\Scripts\Values\BooleanOperand;
use App\Scripts\Values\Instruction;
use App\Scripts\Values\KeywordDefinition;

final readonly class ProfileScriptCompiler implements ScriptCompilation
{
    public function __construct(
        private ScriptChecks $checks,
        private KeywordRegistry $keywords,
        private ObjectRegistry $objects,
        private ReadEntitlements $reads,
    ) {}

    public function compile(ScriptSource $source): CompiledScript
    {
        $check = $this->checks->check($source);

        if ($check->compiled === null) {
            throw InvalidScript::withDiagnostics($check->diagnostics);
        }

        return $check->compiled;
    }

    /**
     * Compiles a profile's script and checks each instruction by its own right: a named host command and a keyword's
     * effect against the profile's host scope, an object read against its read entitlement; a refused operand keeps
     * its source range.
     */
    public function compileForProfile(ScriptSource $source, ProfileDefinition $profile): CompiledScript
    {
        $compiled = $this->compile($source);

        /**
         * @var array<string, Instruction> $instructions
         */
        $instructions = $compiled->graph['instructions'];

        foreach ($instructions as $instruction) {
            $refusal = $this->refusalOf($instruction->keyword, $instruction->operand, $profile);

            if ($refusal !== null) {
                $failure = ScriptSyntaxError::at(DiagnosticCode::CommandNotAllowed, $instruction->source, $refusal);

                throw InvalidScript::withDiagnostics([$failure->diagnostic]);
            }
        }

        return $compiled;
    }

    /**
     * Why the profile may not run this instruction, or null when it may.
     */
    private function refusalOf(string $token, object $operand, ProfileDefinition $profile): string|null
    {
        if ($operand instanceof NamedCommand) {
            return $this->hostRefusal($profile, 'profile.command:'.$operand->key, $operand->effects);
        }

        if ($operand instanceof BooleanOperand) {
            $read = $this->objects->get($operand->object)->members[$operand->member]->read->key;

            return $this->readRefusal($profile, $read);
        }

        $definition = $this->keywords->get($token)->definition;
        $effects = $definition instanceof KeywordDefinition ? $definition->effects : [];

        foreach ($effects as $effect) {
            $refusal = $this->hostRefusal($profile, $effect->value, [AccessType::Execute]);

            if ($refusal !== null) {
                return $refusal;
            }
        }

        return null;
    }

    /**
     * @param  list<AccessType>  $accesses
     */
    private function hostRefusal(ProfileDefinition $profile, string $name, array $accesses): string|null
    {
        $operation = new Operation('script', $name, $accesses, [ResourceRequest::path('.')], [], 1);
        $decision = $profile->start->decide($operation);

        return $decision->allowed ? null : $decision->reason;
    }

    private function readRefusal(ProfileDefinition $profile, string $read): string|null
    {
        $entitlement = $this->reads->of($read);

        $allowed = match ($entitlement->type) {
            ReadEntitlementType::Resolver => true,
            ReadEntitlementType::Grant => $entitlement->isGrantedBy($profile->authorization->grants(...)),
            ReadEntitlementType::Named => $profile->authorization->holdsRead($read, null),
        };

        return $allowed ? null : "The profile does not hold the read {$read}.";
    }
}
