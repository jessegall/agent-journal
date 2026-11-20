<?php

declare(strict_types=1);

namespace App\Communication\States\Support;

use App\Assignments\Models\AssignmentRecord;
use App\Assignments\Models\ClaimAuthorization;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Communication\Models\Message;
use App\Communication\States\AnsweringMessageState;
use App\Hooks\Contracts\StateLoader;
use App\Hooks\Decisions\StateReference;
use App\Hooks\Decisions\StateReferences;
use App\Hooks\Decisions\StateSet;
use App\Hooks\Decisions\SubjectReference;
use App\Hooks\Enums\SessionTransferType;
use App\Hooks\Exceptions\StateSubjectMissing;
use App\Hooks\States\AgentState;
use Illuminate\Database\Eloquent\Collection;

/**
 * Loads answering frames from their claims: each claim's assignment, proof and message are read once for all frames,
 * and a frame stands while its claim exists, its proof holds and its message still waits.
 */
final readonly class AnsweringMessageStateFactory implements StateLoader
{
    public function stateClass(): string
    {
        return AnsweringMessageState::class;
    }

    public function statesFor(StateReferences $references): StateSet
    {
        $claimIds = $references->subjectIds();
        $claims = AssignmentRecord::assignmentsOf($claimIds);
        $proofs = ClaimAuthorization::ofClaims($claimIds);
        $liveHolders = AssignmentRecord::holdersOf(array_merge(...array_map(
            fn (ClaimAuthorization $proof) => $proof->sourceIds(),
            array_values($proofs),
        )));
        $messages = Message::query()->acrossInboxes()
            ->whereKey(array_map(fn ($claim) => $claim->record->id, array_values($claims)))
            ->readLimit(max(1, count($claims)))
            ->get()
            ->keyBy('id');

        return StateSet::build(
            $references,
            fn (StateReference $reference) => $this->stateOf($reference, $claims, $proofs, $liveHolders, $messages),
        );
    }

    /**
     * @param  array<string, Assignment>  $claims
     * @param  array<string, ClaimAuthorization>  $proofs
     * @param  array<string, AssigneeIdentity>  $liveHolders
     * @param  Collection<string, Message>  $messages
     */
    private function stateOf(
        StateReference $reference,
        array $claims,
        array $proofs,
        array $liveHolders,
        Collection $messages,
    ): AgentState {
        $subject = $reference->subject;

        if (! $subject instanceof SubjectReference) {
            throw StateSubjectMissing::for($reference->typeKey);
        }

        $claim = $claims[$subject->id] ?? null;
        $message = $claim === null ? null : $messages->get($claim->record->id);
        $proof = $proofs[$subject->id] ?? null;
        $stands = $claim !== null && $message !== null && $message->needsReply()
            && $proof?->isValidAgainst($claim->holder(), $liveHolders) === true;

        return new AnsweringMessageState($claim?->record->id ?? $subject->id, $stands);
    }

    public function schemaVersion(): int
    {
        return 2;
    }

    public function sessionTransfer(): SessionTransferType
    {
        return SessionTransferType::Durable;
    }
}
