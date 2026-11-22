<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Contracts\CurrentAuthorizer;
use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\StartRecordResolver;
use App\Agents\Exceptions\StartRecordMissing;
use App\Agents\Models\Agent;
use App\Agents\Models\StartRecord;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StartRecordDetails;
use App\Operations\Enums\AccessType;
use PhpOption\None;
use PhpOption\Option;

/**
 * Reads start records for the actor of this request: an agent sees only the starts of itself, and a receipt is read
 * by its requester or by an actor that administers agents.
 */
final readonly class StartRecords implements StartRecordResolver
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $sessions,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function own(string $requestId): StartRecordDetails
    {
        $record = StartRecord::query()->forAgent($this->actors->actor()->id)->where('request_id', $requestId)->first();

        return $record !== null ? self::detailsOf($record) : throw StartRecordMissing::forRequest($requestId);
    }

    public function receipt(string $requestId): StartRecordDetails
    {
        $record = StartRecord::query()
            ->where('request_id', $requestId)
            ->firstOr(fn () => throw StartRecordMissing::forRequest($requestId));

        if (! $record->wasRequestedBy(ActorIdentity::of($this->actors->actor())) && ! $this->maintainsAgents()) {
            throw StartRecordMissing::forRequest($requestId);
        }

        return self::detailsOf($record);
    }

    public function forOwnerReference(string $reference): array
    {
        $this->actors->actor();

        return array_values(StartRecord::query()->forOwnerReference($reference)->orderByDesc('id')->readExactly(
            self::MOST_PER_OWNER,
        )->get()
            ->map(fn (StartRecord $record) => self::detailsOf($record))
            ->all());
    }

    public function currentOwnerStart(): Option
    {
        if (! $this->sessions->hasSession()) {
            return None::create();
        }

        return StartRecord::ownerStartOf($this->sessions->sessionId())->map(self::detailsOf(...));
    }

    private function maintainsAgents(): bool
    {
        return $this->authorizer->filterActions(AgentPolicy::class, Agent::class, [AccessType::Admin]) !== [];
    }

    private static function detailsOf(StartRecord $record): StartRecordDetails
    {
        return new StartRecordDetails(
            $record->request_id,
            $record->agent_id,
            $record->driver,
            $record->model,
            $record->requested_model_type,
            $record->requested_model,
            $record->driver_source,
            $record->origin_type,
            $record->owner_reference,
            $record->conversation_mode,
            $record->disposition,
            $record->session_id,
            $record->refusal_reason,
            $record->refused_at,
        );
    }
}
