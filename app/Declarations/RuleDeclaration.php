<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Values\CommandRule;
use App\Values\DeclaredProposal;
use App\Values\ProposedRule;
use App\Values\RuleExample;
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
        return new DeclaredProposal(
            $this->requestId,
            new ProposedRule(
                CommandRule::fromArray($this->rule),
                $this->evidence,
                array_map(RuleExample::fromArray(...), $this->examples),
            ),
        );
    }
}
