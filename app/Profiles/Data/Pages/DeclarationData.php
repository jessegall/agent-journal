<?php

declare(strict_types=1);

namespace App\Profiles\Data\Pages;

use App\CommandRules\Values\RuleExample;
use App\CommandRules\Values\RuleReference;
use App\Models\CommandRules\RuleProposalRevision;
use App\Processes\Declarations\VerificationContract;
use App\Values\CommandClassSet;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One revision of a proposed declaration as the owner reviews it: canonical and original names, owner, purpose and
 * full-output requirement, effects with what it adds and removes against the active rule, binding, replacement,
 * contract, examples, evidence and the fields a draft still lacks.
 */
#[TypeScript]
final class DeclarationData extends Data
{
    /**
     * @param  list<string>  $spellings
     * @param  list<string>  $classes
     * @param  list<string>  $addedClasses
     * @param  list<string>  $removedClasses
     * @param  list<string>  $replaces
     * @param  list<string>  $contract
     * @param  list<string>  $examples
     * @param  list<string>  $missingFields
     */
    public function __construct(
        public readonly int $revision,
        public readonly string $operation,
        public readonly array $spellings,
        public readonly string $owner,
        public readonly string $purpose,
        public readonly string $outputRequirement,
        public readonly array $classes,
        public readonly array $addedClasses,
        public readonly array $removedClasses,
        public readonly string $binding,
        public readonly array $replaces,
        public readonly array $contract,
        public readonly array $examples,
        public readonly string $evidence,
        public readonly array $missingFields,
    ) {}

    public static function fromRevision(RuleProposalRevision $revision, CommandClassSet $active): self
    {
        $rule = $revision->payload;
        $replaces = array_map(fn (RuleReference $replaced) => $replaced->label(), $rule->replaces);

        $contract = array_merge([], ...array_map(
            fn (VerificationContract $contract) => $contract->description(),
            $rule->contracts,
        ));

        $examples = array_map(fn (RuleExample $example) => $example->label(), $revision->examples->items());

        return new self(
            $revision->revision,
            $rule->operation(),
            $rule->program->spellings,
            $rule->scope->name(),
            $rule->purpose->label(),
            $rule->outputRequirement->value,
            $rule->classes->values(),
            $rule->classes->missingFrom($active)->values(),
            $active->missingFrom($rule->classes)->values(),
            $rule->binding->type->value.' '.implode(', ', $rule->binding->locations),
            $replaces,
            $contract,
            $examples,
            $revision->evidence,
            $revision->proposed_rule->missingFields(),
        );
    }
}
