<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\StartReceipts;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Models\AgentSession;
use App\Agents\Models\SessionPolicy;
use App\Agents\Models\StartRecord;
use App\Agents\Support\OwnerStartReceipt;
use App\Agents\Support\OwnerStartRequest;
use App\Agents\Support\StartReceipt;
use App\Records\Support\RecordIdentity;

/**
 * Reads an owner's start again from its start record, found by the work and the actor that asked; another actor's
 * start answers as missing.
 */
final readonly class OwnerStartReceipts implements StartReceipts
{
    public function __construct(private CurrentActor $actors) {}

    public function receiptFor(RecordIdentity $work): OwnerStartReceipt
    {
        $reference = OwnerStartRequest::ownerReferenceOf($work);

        $record = StartRecord::query()
            ->forOwnerReference($reference)
            ->requestedBy(ActorIdentity::of($this->actors->actor()))
            ->whereNotNull('session_id')
            ->latest()
            ->firstOr(fn () => throw StartRecordMissing::forRequest($reference));

        $session = AgentSession::query()->findOrFail($record->session_id);
        $policy = SessionPolicy::query()->where('session_id', $session->id)->sole()->policy();

        return new OwnerStartReceipt(
            $record->request_id,
            $session->selection(),
            true,
            $record->conversation_mode,
            $policy->execution->mode,
            $policy->configurationHash,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
        );
    }
}
