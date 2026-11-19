<?php

declare(strict_types=1);

namespace App\Processes\Support;

use App\Processes\Models\OutputAssessment;
use App\Processes\Models\ResultReceipt;
use App\Processes\Values\VerifiedOutput;

/**
 * Writes a result receipt only after reading the stored assessment and its run again through the validator, and
 * supersedes the part's earlier receipt.
 */
final readonly class ReceiptPublisher
{
    public function __construct(private EvidenceValidator $validator) {}

    public function publish(VerifiedOutput $verified): ResultReceipt
    {
        $stored = OutputAssessment::query()->findOrFail($verified->assessment->id);
        $checked = $this->validator->verify($stored);
        $earlier = ResultReceipt::query()
            ->current()
            ->where('part_run_id', $checked->part->id)
            ->lockForUpdate()
            ->first();
        $receipt = ResultReceipt::publish($checked, $this->exitPolicyDigest($checked));
        $earlier?->supersedeBy($receipt);

        return $receipt;
    }

    private function exitPolicyDigest(VerifiedOutput $verified): string
    {
        $contracts = $verified->declaration->payload->contracts;
        $exits = $contracts === [] ? [] : $contracts[0]->exits->toArray();

        return hash('sha256', json_encode($exits, JSON_THROW_ON_ERROR));
    }
}
