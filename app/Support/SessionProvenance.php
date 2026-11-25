<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Sessions\CurrentSession;
use App\Contracts\Sessions\SessionPolicyReader;
use App\Contracts\Sessions\SessionProvenance as SessionProvenanceContract;
use App\Models\Agents\AgentSession;
use App\Models\Records\Link;
use App\Values\Operation;
use App\Values\OperationGrant;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class SessionProvenance implements SessionProvenanceContract
{
    public function __construct(
        private CurrentSession $session,
        private IdentityLinks $links,
        private SessionPolicyReader $policies,
        private LinkRemoval $removal,
    ) {}

    public function record(Model $record): void
    {
        if ($this->session->hasSession()) {
            $this->links->link($record, new RecordIdentity(AgentSession::linkType(), $this->session->sessionId()));
        }
    }

    public function inherit(Model $record, Model $source): void
    {
        foreach ($this->links->linkedOfType($source, AgentSession::linkType()) as $origin) {
            Link::createForKey($record, $origin->type, $origin->id);
        }
    }

    public function forget(Model $record): void
    {
        $this->removal->forgetModels([$record]);
    }

    public function isFromCurrentSession(Model $record): bool
    {
        if (! $this->session->hasSession()) {
            return false;
        }

        return $this->fromSession($record->newQuery(), $this->session->sessionId())
            ->whereKey($record->getKey())
            ->exists();
    }

    /**
     * @template T of Model
     *
     * @param  Builder<T>  $records
     */
    public function limitToCurrentSession(Builder $records): void
    {
        $this->fromSession($records, $this->session->sessionId());
    }

    /**
     * @template T of Model
     *
     * @param  Builder<T>  $records
     * @return Builder<T>
     */
    public function fromSession(Builder $records, string $sessionId): Builder
    {
        return $this->links->among($records, new RecordIdentity(AgentSession::linkType(), $sessionId));
    }

    public function parentOf(Model $record): ActorIdentity|null
    {
        $parent = $this->parentSessionOf($record);

        if ($parent === null) {
            return null;
        }

        return ActorIdentity::forAgent($parent->agent_id);
    }

    public function doesParentHaveGrant(Model $record, Operation $operation): bool
    {
        if (! $this->session->hasSession()) {
            return false;
        }

        $current = $this->session->sessionId();
        $parent = $this->parentSessionOf($record);

        if ($parent?->id !== $current || ! $this->policies->isFrozenFor($current)) {
            return false;
        }

        $access = $this->policies->policyFor($current)->access;

        return $access->decide($operation)->isAllowed && array_any(
            $access->operationGrants,
            fn (OperationGrant $grant) => $grant->resources !== [] && $grant->covers($operation),
        );
    }

    private function parentSessionOf(Model $record): AgentSession|null
    {
        $origin = $this->links->linkedOfType($record, AgentSession::linkType())[0] ?? null;

        if ($origin === null) {
            return null;
        }

        $parent = AgentSession::query()->whereKey($origin->id)->value('parent_session_id');

        if ($parent === null) {
            return null;
        }

        return AgentSession::query()->whereKey($parent)->first();
    }
}
