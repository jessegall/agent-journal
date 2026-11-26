<?php

declare(strict_types=1);

namespace App\CommandRules\Values;

/**
 * One proposal read from a declaration file: the request id that makes a second import the same proposal, and the
 * rule with its evidence and examples.
 */
final readonly class DeclaredProposal
{
    public function __construct(public string $requestId, public ProposedRule $proposed) {}
}
