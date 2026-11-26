<?php

declare(strict_types=1);

namespace App\CommandRules\Declarations;

use App\CommandRules\Values\DeclaredProposal;
use App\CommandRules\Values\ProposedRule;
use App\CommandRules\Values\RuleExample;
use App\Values\CommandRule;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One declaration of a declaration file after its fields were validated: the request id, the evidence, the examples
 * and the rule, each still in the stored shape its own value reads.
 */
#[MapName(SnakeCaseMapper::class)]
final class RuleDeclaration extends Data
{
    /**
     * @param  list<array<string, mixed>>  $examples
     * @param  array<string, mixed>  $rule
     */
    public function __construct(
        public readonly string $requestId,
        public readonly string $evidence,
        public readonly array $examples,
        public readonly array $rule,
    ) {}

    public function toProposal(): DeclaredProposal
    {
        $rule = CommandRule::from($this->rule);
        $collected = RuleExample::collect($this->examples);
        $examples = array_values($collected);

        return new DeclaredProposal($this->requestId, new ProposedRule($rule, $this->evidence, $examples));
    }
}
