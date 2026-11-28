<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Access\Contracts\CurrentAuthorizer;
use App\Actors\Contracts\CurrentActor;
use App\Agents\Enums\AccessType;
use App\Models\Agents\Agent;
use App\Models\Sessions\SessionRequest;
use App\Policies\AgentPolicy;
use App\Sessions\Contracts\CurrentSession;
use App\Sessions\Contracts\SessionRequestResolver as SessionRequestResolverContract;
use App\Sessions\Exceptions\SessionRequestMissing;
use App\Sessions\SessionRequestDetails;
use PhpOption\None;
use PhpOption\Option;

/**
 * Reads start records for the actor of this request: an agent sees only the starts of itself, and a receipt is read
 * by its requester or by an actor that administers agents.
 */
final readonly class SessionRequestResolver implements SessionRequestResolverContract
{
    public function __construct(
        private CurrentActor $actors,
        private CurrentSession $sessions,
        private CurrentAuthorizer $authorizer,
    ) {}

    public function own(string $requestId): SessionRequestDetails
    {
        $record = SessionRequest::query()->forAgent($this->actors->actor()->id)->underRequest($requestId)->first();

        if ($record !== null) {
            return self::detailsOf($record);
        }

        throw SessionRequestMissing::forRequest($requestId);
    }

    public function receipt(string $requestId): SessionRequestDetails
    {
        $record = SessionRequest::query()
            ->underRequest($requestId)
            ->firstOr(SessionRequestMissing::throwing()->forRequest($requestId));

        if (! $record->wasRequestedBy($this->actors->actor()) && ! $this->maintainsAgents()) {
            throw SessionRequestMissing::forRequest($requestId);
        }

        return self::detailsOf($record);
    }

    public function forOwnerReference(string $reference): array
    {
        $this->actors->actor();

        return array_values(SessionRequest::query()->forOwnerReference($reference)->newestFirst()->limit(
            self::MOST_PER_OWNER,
        )->get()
            ->map(fn (SessionRequest $record) => self::detailsOf($record))
            ->all());
    }

    public function currentOwnerStart(): Option
    {
        if (! $this->sessions->hasSession()) {
            return None::create();
        }

        return SessionRequest::findOwnerStartOf($this->sessions->sessionId())->map(self::detailsOf(...));
    }

    private function maintainsAgents(): bool
    {
        return $this->authorizer->filterActions(AgentPolicy::class, Agent::class, [AccessType::Admin]) !== [];
    }

    private static function detailsOf(SessionRequest $record): SessionRequestDetails
    {
        return new SessionRequestDetails(
            $record->request_id,
            $record->agent_id,
            $record->family,
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
