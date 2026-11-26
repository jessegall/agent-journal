<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Sessions\Contracts\StartReceipts as StartReceiptsContract;
use App\Sessions\Exceptions\SessionRequestMissing;
use App\Sessions\OwnerStartReceipt;
use App\Sessions\StartReceipt;
use App\Support\RecordIdentity;

/**
 * Reads an owner's start again from its start record, found by the work and the actor that asked; another actor's
 * start answers as missing.
 */
final readonly class StartReceipts implements StartReceiptsContract
{
    public function __construct(private CurrentActor $actors) {}

    public function receiptFor(RecordIdentity $work): OwnerStartReceipt
    {
        $reference = $work->reference();

        $record = SessionRequest::query()
            ->forOwnerReference($reference)
            ->requestedBy($this->actors->actor())
            ->withSession()
            ->newestCreatedFirst()
            ->firstOr(SessionRequestMissing::throwing()->forRequest($reference));

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
