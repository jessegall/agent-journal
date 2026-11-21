<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Links\Support\LinkRemoval;
use App\Actors\Support\ActorContext;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Contracts\SessionProvenance as SessionProvenanceContract;
use App\Agents\Models\AgentSession;
use App\Agents\Values\Operation;
use App\Agents\Values\OperationGrant;
use App\Links\Models\Link;
use App\Records\Contracts\IdentityLinks;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final readonly class SessionProvenance implements SessionProvenanceContract
{
    private const string SESSION = 'core.agent-session';

    public function __construct(
        private CurrentSession $session,
        private IdentityLinks $links,
        private SessionPolicyReader $policies,
        private LinkRemoval $removal,
    ) {}

    public function record(Model $record): void
    {
        if ($this->session->hasSession()) {
            $this->links->link($record, new RecordIdentity(self::SESSION, $this->session->sessionId()));
        }
    }

    public function inherit(Model $record, Model $source): void
    {
        foreach ($this->links->linkedOfType($source, self::SESSION) as $origin) {
            Link::connectKey($record, $origin->type, $origin->id);
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
        return $this->links->among($records, new RecordIdentity(self::SESSION, $sessionId));
    }

    public function parentOf(Model $record): ActorContext|null
    {
        $parent = $this->parentSessionOf($record);

        return $parent === null ? null : ActorContext::forAgent($parent->agent_id);
    }

    public function parentHasGrant(Model $record, Operation $operation): bool
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

        return $access->decide($operation)->allowed && array_any(
            $access->operationGrants,
            fn (OperationGrant $grant): bool => $grant->resources !== [] && $grant->covers($operation),
        );
    }

    private function parentSessionOf(Model $record): AgentSession|null
    {
        $origin = $this->links->linkedOfType($record, self::SESSION)[0] ?? null;

        if ($origin === null) {
            return null;
        }

        $parent = AgentSession::query()->whereKey($origin->id)->value('parent_session_id');

        return $parent === null ? null : AgentSession::query()->whereKey($parent)->first();
    }
}
