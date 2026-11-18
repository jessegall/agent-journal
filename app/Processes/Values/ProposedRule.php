<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * What one proposal revision submits for review: the validated rule, the evidence for its behaviour and its examples.
 * It is complete only with evidence and at least one line the rule must match; until then the proposal stays a draft.
 */
final readonly class ProposedRule
{
    /**
     * @param  list<RuleExample>  $examples
     */
    public function __construct(public CommandRule $rule, public string $evidence, public array $examples) {}

    public function isComplete(): bool
    {
        $matches = array_any($this->examples, fn (RuleExample $example): bool => $example->isPositive());

        return trim($this->evidence) !== '' && $matches;
    }

    /**
     * The digest a proposal's request id is bound to: the rule, its evidence and its examples together.
     */
    public function digest(): string
    {
        $examples = array_map(fn (RuleExample $example): array => $example->toArray(), $this->examples);

        return hash('sha256', json_encode([$this->rule->toArray(), $this->evidence, $examples], JSON_THROW_ON_ERROR));
    }
}
