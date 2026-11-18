<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * What importing a declaration file answers: one proposal receipt per declaration, in the file's order.
 */
final readonly class ImportedProposals
{
    /**
     * @param  list<ProposalReceipt>  $receipts
     */
    public function __construct(public array $receipts) {}

    /**
     * @return list<array{proposal_id: string, revision: int, state: string, missing_fields: list<string>}>
     */
    public function toArray(): array
    {
        return array_map(fn (ProposalReceipt $receipt): array => $receipt->toArray(), $this->receipts);
    }
}
