<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Authorization\ReadEntitlements;
use App\Contracts\Scripts\ScriptChecks;
use App\Contracts\Scripts\ScriptCompilation as ScriptCompilationContract;
use App\Enums\Agents\AccessType;
use App\Enums\Profiles\DiagnosticCode;
use App\Enums\Profiles\ReadEntitlementType;
use App\Exceptions\InvalidScript;
use App\Exceptions\ScriptSyntaxError;
use App\Values\BooleanOperand;
use App\Values\CompiledScript;
use App\Values\NamedCommand;
use App\Values\Operation;
use App\Values\ProfileDefinition;
use App\Values\ResourceRequest;
use App\Values\ScriptKeywordDefinition;
use App\Values\ScriptSource;

final readonly class ScriptCompilation implements ScriptCompilationContract
{
    public function __construct(
        private ScriptChecks $checks,
        private ScriptKeywordRegistration $keywords,
        private ScriptObjectRegistration $objects,
        private ReadEntitlements $reads,
        private AgentTexts $texts,
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

        foreach ($compiled->instructions as $instruction) {
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
        $effects = $definition instanceof ScriptKeywordDefinition ? $definition->effects : [];

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

        if ($decision->isAllowed) {
            return null;
        }

        return $this->texts->render($decision->reason);
    }

    private function readRefusal(ProfileDefinition $profile, string $read): string|null
    {
        $entitlement = $this->reads->of($read);

        $allowed = match ($entitlement->type) {
            ReadEntitlementType::Resolver => true,
            ReadEntitlementType::Grant => $entitlement->isGrantedBy($profile->authorization->grants(...)),
            ReadEntitlementType::Named => $profile->authorization->holdsRead($read, null),
        };

        if ($allowed) {
            return null;
        }

        return "The profile does not hold the read {$read}.";
    }
}
