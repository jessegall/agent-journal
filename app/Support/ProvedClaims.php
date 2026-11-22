<?php

declare(strict_types=1);

namespace App\Support;

use App\Models\AssignmentRecord;
use App\Models\ClaimAuthorization;

/**
 * The current claims on records of one type whose proofs still hold: the claims, their proofs and the assignments the
 * proofs stand on are each read once, and every proof is judged in memory.
 */
final readonly class ProvedClaims
{
    /**
     * @param  list<string>  $recordIds
     * @return array<string, Assignment>
     */
    public function validClaimsOn(string $type, array $recordIds): array
    {
        if ($recordIds === []) {
            return [];
        }

        $claims = AssignmentRecord::ofRecords($type, $recordIds);
        $proofs = ClaimAuthorization::ofClaims(array_map(fn (AssignmentRecord $claim) => $claim->id, $claims));

        $liveHolders = AssignmentRecord::holdersOf(array_merge(...array_map(
            fn (ClaimAuthorization $proof) => $proof->sourceIds(),
            array_values($proofs),
        )));

        $valid = [];

        foreach ($claims as $claim) {
            $assignment = $claim->toAssignment();
            $proof = $proofs[$claim->id] ?? null;

            if ($proof?->isValidAgainst($assignment->holder(), $liveHolders) === true) {
                $valid[$assignment->record->id] = $assignment;
            }
        }

        return $valid;
    }
}
