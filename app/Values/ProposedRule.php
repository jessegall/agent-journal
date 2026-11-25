<?php

declare(strict_types=1);

namespace App\Values;

/**
 * What one proposal revision submits for review: the validated rule, the evidence for its behaviour and its examples.
 * It is complete only with evidence, a line the rule must match and each contract's exit policy; until then the
 * proposal stays a draft.
 */
final readonly class ProposedRule
{
    /**
     * @param  list<RuleExample>  $examples
     */
    public function __construct(public CommandRule $rule, public string $evidence, public array $examples) {}

    public function isComplete(): bool
    {
        return $this->missingFields() === [];
    }

    /**
     * The fields review still needs: evidence, a line the rule must match, and the exit policy of each contract.
     *
     * @return list<string>
     */
    public function missingFields(): array
    {
        $missing = [];

        if (trim($this->evidence) === '') {
            $missing[] = 'evidence';
        }

        if (! array_any($this->examples, fn (RuleExample $example): bool => $example->isPositive())) {
            $missing[] = 'examples';
        }

        foreach ($this->rule->contracts as $index => $contract) {
            if ($contract->exits->branches === []) {
                $missing[] = "contracts.{$index}.exits";
            }
        }

        return $missing;
    }

    /**
     * The digest a proposal's request id is bound to: the rule, its evidence and its examples together.
     */
    public function digest(): string
    {
        $examples = array_map(fn (RuleExample $example): array => $example->toArray(), $this->examples);

        return hash('sha256', json_encode([
            $this->rule->toArray(),
            $this->evidence,
            $examples,
        ], JSON_THROW_ON_ERROR));
    }
}
