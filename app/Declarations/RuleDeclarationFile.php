<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Values\DeclaredProposal;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * A declaration file after its fields were validated: the declarations it holds, in order.
 */
final class RuleDeclarationFile extends Data
{
    /**
     * @param  list<RuleDeclaration>  $declarations
     */
    public function __construct(
        #[DataCollectionOf(RuleDeclaration::class)]
        public readonly array $declarations,
    ) {}

    /**
     * @return list<DeclaredProposal>
     */
    public function toProposals(): array
    {
        return array_map(
            fn (RuleDeclaration $declaration): DeclaredProposal => $declaration->toProposal(),
            $this->declarations,
        );
    }
}
