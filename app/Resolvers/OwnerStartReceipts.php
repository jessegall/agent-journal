<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Sessions\StartReceipts;
use App\Exceptions\StartRecordMissing;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Support\ActorIdentity;
use App\Support\OwnerStartReceipt;
use App\Support\RecordIdentity;
use App\Support\StartReceipt;

/**
 * Reads an owner's start again from its start record, found by the work and the actor that asked; another actor's
 * start answers as missing.
 */
final readonly class OwnerStartReceipts implements StartReceipts
{
    public function __construct(private CurrentActor $actors) {}

    public function receiptFor(RecordIdentity $work): OwnerStartReceipt
    {
        $reference = $work->reference();

        $record = SessionRequest::query()
            ->forOwnerReference($reference)
            ->requestedBy(ActorIdentity::of($this->actors->actor()))
            ->withSession()
            ->newestCreatedFirst()
            ->firstOr(StartRecordMissing::throwing()->forRequest($reference));

        $session = AgentSession::query()->findOrFail($record->session_id);
        $policy = SessionPolicy::query()->ofSession($session->id)->sole()->policy;

        return new OwnerStartReceipt(
            $record->request_id,
            $session->selection,
            true,
            $record->conversation_mode,
            $policy->execution->mode,
            $policy->configurationHash,
            StartReceipt::ACTUAL_MODEL_NOT_REPORTED,
        );
    }
}
