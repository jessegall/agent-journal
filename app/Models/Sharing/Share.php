<?php

declare(strict_types=1);

namespace App\Models\Sharing;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\Numbered;
use App\Contracts\Records\ReadableModel;
use App\Enums\ActorType;
use App\Enums\ShareState;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareRequested;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Exceptions\ShareEndInvalid;
use App\Exceptions\ShareGatewayUnavailable;
use App\Exceptions\ShareProposalUnavailable;
use App\Exceptions\ShareRetryRefused;
use App\Exceptions\ShareUnavailable;
use App\Models\Support\BelongsToOneRoot;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\ShareFact;
use App\Support\ShareGrant;
use App\Support\ShareListFilters;
use App\Support\ShareProposal;
use App\Support\ShareProposalStatus;
use App\Support\ShareSummary;
use App\Support\ShareToken;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use PhpOption\None;
use PhpOption\Option;

/**
 * A public share of one root record: an agent's proposal, or the owner's grant with its bearer token kept as a
 * digest and as ciphertext for the owner alone, its gateway configuration version, its approved scope version and
 * its deadline. Neither token column is ever serialized.
 *
 * @property string $id
 * @property string $number_group_id
 * @property int $number
 * @property ShareState $state
 * @property string $root_type
 * @property string $root_id
 * @property string|null $owner_user_id
 * @property ActorType|null $requester_type
 * @property string|null $requester_id
 * @property string|null $share_gateway_configuration_id
 * @property int|null $configuration_version
 * @property int $scope_version
 * @property string|null $token_digest
 * @property string|null $token_ciphertext
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $terminal_at
 * @property int $pruned_allowed_reads
 * @property int $pruned_denied_reads
 * @property int $pruned_lifecycle_rows
 * @property CarbonImmutable|null $last_pruned_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Hidden(['token_digest', 'token_ciphertext'])]
#[Fillable(
    [
        'state',
        'root_type',
        'root_id',
        'owner_user_id',
        'configuration_version',
        'scope_version',
        'expires_at',
        'terminal_at',
    ],
)]
final class Share extends Model implements EventSource, Numbered, ReadableModel
{
    use BelongsToOneRoot;
    use BoundedReads;
    use HasNumber;
    use HasUlids;
    use Linkable;
    use RaisesEvents;

    public const string LINK_TYPE = 'core.share';

    /**
     * The most live, unexpired shares an installation holds at once.
     */
    public const int LIVE_LIMIT = 100;

    /**
     * The scope version of a grant's first approved member list; a proposal has none yet, at 0.
     */
    public const int FIRST_SCOPE_VERSION = 1;

    /**
     * The most unexpired proposals the installation holds at once.
     */
    public const int PROPOSED_LIMIT = 100;

    /**
     * How long a proposal waits for the owner before it expires.
     */
    public const int PROPOSAL_DAYS = 7;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'state' => ShareState::class,
            'requester_type' => ActorType::class,
            'configuration_version' => 'integer',
            'scope_version' => 'integer',
            'token_ciphertext' => 'encrypted',
            'expires_at' => 'immutable_datetime',
            'terminal_at' => 'immutable_datetime',
            'pruned_allowed_reads' => 'integer',
            'pruned_denied_reads' => 'integer',
            'pruned_lifecycle_rows' => 'integer',
            'last_pruned_at' => 'immutable_datetime',
        ];
    }

    /**
     * A share of the root until its expiry. From an agent's request it is a proposal with no token and no gateway,
     * kept until the owner approves it or it expires; from the owner's grant it holds a new token under a gateway
     * configuration at its first scope version, waiting for its gateway.
     */
    public static function create(
        RecordIdentity $root,
        CarbonImmutable $expiresAt,
        ShareProposal|ShareGrant $origin,
    ): self {
        if ($origin instanceof ShareProposal) {
            $share = self::forRoot($root, ShareState::Proposed, $expiresAt);
            $share->requester_type = $origin->requester->type;
            $share->requester_id = $origin->requester->id;
            $share->assertSaved($share->save());
            $share->raise(new ShareRequested($share->fact()));

            return $share;
        }

        $share = self::forRoot($root, ShareState::Pending, $expiresAt);
        $share->owner_user_id = $origin->ownerUserId;
        $share->scope_version = self::FIRST_SCOPE_VERSION;
        $share->share_gateway_configuration_id = $origin->configurationId;
        $share->configuration_version = $origin->configurationVersion;
        $share->token_digest = $origin->token->digest;
        $share->token_ciphertext = $origin->token->token;
        $share->assertSaved($share->save());
        $share->raise(new ShareCreated($share->fact()));

        return $share;
    }

    // ----------[ Queries ]----------

    /**
     * The share of this id, locked until the transaction ends.
     *
     * @throws ShareUnavailable
     */
    public static function lockForChange(string $id): self
    {
        return self::query()->whereKey($id)->lockForUpdate()->firstOr(fn () => throw ShareUnavailable::for($id));
    }

    /**
     * The proposals and live shares whose deadline has passed but whose state has not caught up, oldest first and
     * locked, at most the given number.
     *
     * @return list<self>
     */
    public static function lockPastDeadline(int $most): array
    {
        return array_values(
            self::query()->pastDeadline()->orderBy('id')->lockForUpdate()->readExactly($most)->get()->all(),
        );
    }

    /**
     * The configuration's unexpired shares waiting for their gateway or failed on it, by id and locked.
     *
     * @return list<self>
     */
    public static function lockAwaitingGatewayOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->awaitingGateway()->orderBy('id')->lockForUpdate()->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The ids of the shares that ended before the cutoff, as a subquery.
     *
     * @return Builder<self>
     */
    public static function endedBefore(CarbonImmutable $cutoff): Builder
    {
        return self::query()->whereNotNull('terminal_at')->where('terminal_at', '<', $cutoff)->select('id');
    }

    /**
     * The gateway configurations that serve at least one share still live and unexpired: what a new supervisor run
     * opens again. Proposals and ended shares never open a tunnel.
     *
     * @return list<string>
     */
    public static function configurationsToReopen(): array
    {
        return array_values(
            array_unique(
                array_map(
                    strval(...),
                    self::query()->liveNow()->whereNotNull('share_gateway_configuration_id')->readExactly(
                        self::LIVE_LIMIT,
                    )->pluck('share_gateway_configuration_id')->all(),
                ),
            ),
        );
    }

    /**
     * Every share the configuration's gateway serves that has not ended, whatever its deadline, by id: what disabling
     * the gateway would revoke.
     *
     * @return list<self>
     */
    public static function unendedOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->unended()->orderBy('id')->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * Every share the configuration's gateway serves that has not ended, whatever its deadline, by id and locked.
     *
     * @return list<self>
     */
    public static function lockUnendedOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->unended()->orderBy('id')->lockForUpdate()->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The configuration's pending shares, by id and locked.
     *
     * @return list<self>
     */
    public static function lockPendingOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->inState(
                ShareState::Pending,
            )->orderBy('id')->lockForUpdate()->limit(self::LIVE_LIMIT)->get()->all(),
        );
    }

    /**
     * Whether any live, unexpired share is served by the configuration.
     */
    public static function anyLiveOn(string $configurationId): bool
    {
        return self::query()->liveNow()->servedBy($configurationId)->exists();
    }

    /**
     * How many unexpired proposals the installation holds now; counted under the installation lock.
     */
    public static function proposedCount(): int
    {
        return self::query()->proposedNow()->count();
    }

    /**
     * The unexpired proposal of this id, locked until the transaction ends.
     *
     * @throws ShareProposalUnavailable
     */
    public static function lockProposal(string $id): self
    {
        return self::query()->whereKey($id)->proposedNow()->lockForUpdate()->firstOr(
            fn () => throw ShareProposalUnavailable::for($id),
        );
    }

    /**
     * The actor's newest proposals, whatever became of them.
     *
     * @return list<self>
     */
    public static function proposedBy(ActorIdentity $requester): array
    {
        return array_values(
            self::query()->requestedBy($requester)->orderByDesc('id')->limit(self::PROPOSED_LIMIT)->get()->all(),
        );
    }

    /**
     * The newest live, unexpired share of the root, if it has one.
     *
     * @return Option<self>
     */
    public static function liveFor(RecordIdentity $root): Option
    {
        return Option::fromValue(self::query()->ofRoot($root)->liveNow()->orderByDesc('id')->first());
    }

    /**
     * The current scope version of each of these shares that is live and unexpired, by share id.
     *
     * @param  list<string>  $ids
     * @return array<string, int>
     */
    public static function liveScopeVersions(array $ids): array
    {
        return self::query()->whereKey($ids)->liveNow()->readExactly(count($ids))->pluck('scope_version', 'id')->map(
            fn (mixed $version) => (int) $version,
        )->all();
    }

    /**
     * How many live, unexpired shares the installation holds now, whatever their state column has caught up with;
     * counted under the installation lock.
     */
    public static function liveCount(): int
    {
        return self::query()->liveNow()->count();
    }

    /**
     * One page of shares and proposals, newest first, narrowed by the owner's filters; one more row than the page
     * holds is read so the caller knows whether another page follows.
     *
     * @return list<self>
     */
    public static function listPage(ShareListFilters $filters, int $rows): array
    {
        $query = self::query()->orderByDesc('id');
        $query->when($filters->state, fn (Builder $query, ShareState $state) => $query->inState($state));
        $query->when($filters->rootType, fn (Builder $query, string $type) => $query->ofRootType($type));
        $query->when($filters->configurationId, fn (Builder $query, string $id) => $query->servedBy($id));

        $query->when(
            $filters->expiresBefore,
            fn (Builder $query, CarbonImmutable $deadline) => $query->expiringBefore($deadline),
        );

        $query->when($filters->after, fn (Builder $query, string $id) => $query->olderThan($id));

        return array_values($query->readExactly($rows + 1)->get()->all());
    }

    /**
     * The share of this id, if there is one.
     *
     * @return Option<self>
     */
    public static function byId(string $id): Option
    {
        return Option::fromValue(self::query()->whereKey($id)->first());
    }

    /**
     * The open proposals of the root, newest first.
     *
     * @return list<self>
     */
    public static function openProposalsFor(RecordIdentity $root): array
    {
        return array_values(
            self::query()->ofRoot($root)->proposedNow()->orderByDesc('id')->readExactly(
                self::PROPOSED_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The share of this id granted by the owner, if there is one.
     *
     * @return Option<self>
     */
    public static function grantedBy(string $ownerUserId, string $id): Option
    {
        return Option::fromValue(self::query()->whereKey($id)->grantedByOwner($ownerUserId)->first());
    }

    /**
     * The share a token digest opens, with only its id, state, scope version and deadline: the one query the public
     * bridge runs, as the system, before any read.
     *
     * @return Option<self>
     */
    public static function forTokenDigest(string $digest): Option
    {
        return Option::fromValue(
            self::query()->openedByDigest($digest)->first(['id', 'state', 'scope_version', 'expires_at']),
        );
    }

    /**
     * The share locked for reading until the transaction ends: readers share the lock, while a revoke or a scope
     * change waits for them.
     */
    public static function lockForRead(string $id): self
    {
        return self::query()->whereKey($id)->sharedLock()->firstOrFail();
    }

    // ----------[ Mutations ]----------

    /**
     * Turns the proposal into the owner's grant under a gateway configuration with a new token, at its first scope
     * version and with its own deadline, waiting for its gateway.
     */
    public function approveAs(
        string $ownerUserId,
        ShareGatewayConfiguration $configuration,
        ShareToken $token,
        CarbonImmutable $expiresAt,
    ): void {
        $this->state = ShareState::Pending;
        $this->owner_user_id = $ownerUserId;
        $this->scope_version = self::FIRST_SCOPE_VERSION;
        $this->expires_at = $expiresAt;
        $this->share_gateway_configuration_id = $configuration->id;
        $this->configuration_version = $configuration->configuration_version;
        $this->token_digest = $token->digest;
        $this->token_ciphertext = $token->token;
        $this->assertSaved($this->save());
        $this->raise(new ShareCreated($this->fact()));
    }

    /**
     * Ends the share as revoked or expired once and raises that fact; false, with nothing changed, when it had already
     * ended. Its token can no longer be read back, while its digest stays so a read with the old token is denied.
     *
     * @throws ShareEndInvalid
     */
    public function end(ShareState $terminal): bool
    {
        if ($terminal !== ShareState::Revoked && $terminal !== ShareState::Expired) {
            throw ShareEndInvalid::for($this->id, $terminal);
        }

        if ($this->state->isTerminal()) {
            return false;
        }

        $endedAt = CarbonImmutable::now();
        $this->state = $terminal;
        $this->terminal_at = $endedAt;
        $this->token_ciphertext = null;
        $this->assertSaved($this->save());

        match ($terminal) {
            ShareState::Revoked => $this->raise(new ShareRevoked($this->factAt($endedAt))),
            ShareState::Expired => $this->raise(new ShareExpired($this->factAt($endedAt))),
        };

        return true;
    }

    /**
     * Moves the share to its next scope version, whose members are approved next; earlier members stop counting.
     */
    public function advanceScope(): void
    {
        $this->scope_version++;
        $this->assertSaved($this->save());
        $this->raise(new ShareScopeChanged($this->fact()));
    }

    /**
     * Puts a pending or failed share back to waiting for its gateway, keeping its token and deadline.
     *
     * @throws ShareRetryRefused when the share may not be retried or its deadline passed
     */
    public function retryOpening(): void
    {
        if (! $this->state->mayRetry() || ! $this->expires_at->isFuture()) {
            throw ShareRetryRefused::for($this->id, $this->expires_at->isFuture() ? $this->state : ShareState::Expired);
        }

        $this->state = ShareState::Pending;
        $this->save();
    }

    /**
     * Keeps the count of the audit rows pruning removed, and when it last pruned, so the share's history stays
     * counted after its details are gone.
     */
    public function countPruned(int $allowedReads, int $deniedReads, int $lifecycleRows, CarbonImmutable $at): void
    {
        $this->pruned_allowed_reads += $allowedReads;
        $this->pruned_denied_reads += $deniedReads;
        $this->pruned_lifecycle_rows += $lifecycleRows;
        $this->last_pruned_at = $at;
        $this->save();
    }

    /**
     * Its gateway serves it now.
     */
    public function activate(): void
    {
        $this->state = ShareState::Active;
        $this->assertSaved($this->save());
        $this->raise(new ShareActivated($this->fact()));
    }

    /**
     * Its gateway could not open; the owner may retry before the deadline.
     */
    public function failActivation(): void
    {
        $this->state = ShareState::Failed;
        $this->assertSaved($this->save());
        $this->raise(new ShareFailed($this->fact()));
    }

    // ----------[ Answers ]----------

    /**
     * The key of the gateway the share is served under; none for a proposal, which has no gateway yet.
     */
    public function gatewayKey(): string|null
    {
        if ($this->share_gateway_configuration_id === null) {
            return null;
        }

        return ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id)->gateway_key;
    }

    /**
     * The newest endpoint still running for the share's gateway configuration; none for a proposal.
     *
     * @return Option<ShareGatewayEndpoint>
     */
    public function newestRunningEndpoint(): Option
    {
        if ($this->share_gateway_configuration_id === null) {
            return None::create();
        }

        return ShareGatewayEndpoint::newestRunningOf(
            ShareGatewayConfiguration::query()->findOrFail($this->share_gateway_configuration_id),
        );
    }

    /**
     * The enabled gateway configuration the owner's grant is served under.
     *
     * @throws ShareGatewayUnavailable when the share is a proposal or its configuration was disabled
     */
    public function gatewayConfiguration(): ShareGatewayConfiguration
    {
        if ($this->share_gateway_configuration_id === null) {
            throw ShareGatewayUnavailable::forProposal($this->id);
        }

        return ShareGatewayConfiguration::usable($this->share_gateway_configuration_id);
    }

    /**
     * Whether no other live, unexpired share is served by this share's gateway configuration.
     */
    public function isLastLiveOfItsConfiguration(): bool
    {
        return $this->share_gateway_configuration_id !== null
            && ! self::query()
                ->liveNow()
                ->servedBy($this->share_gateway_configuration_id)
                ->whereKeyNot($this->id)
                ->exists();
    }

    /**
     * Whether a public read may proceed: the share is active and its deadline has not passed, whatever the state
     * column has caught up with.
     */
    public function isReadableNow(): bool
    {
        return $this->state === ShareState::Active && $this->expires_at->isFuture();
    }

    /**
     * The public address of the share while it is active and unexpired; nothing for a proposal or an ended share.
     *
     * @return Option<string>
     */
    public function ownerUrl(): Option
    {
        if (! $this->isReadableNow()
            || $this->token_ciphertext === null
            || $this->share_gateway_configuration_id === null) {
            return None::create();
        }

        return Option::fromValue(
            ShareGatewayConfiguration::query()->findOrFail(
                $this->share_gateway_configuration_id,
            )->shareUrl($this->token_ciphertext),
        );
    }

    /**
     * What a lifecycle event tells about the share as it stands now.
     */
    public function fact(): ShareFact
    {
        return $this->factAt(CarbonImmutable::now());
    }

    /**
     * What the owner learns of the share: its id, number and state, never its token.
     */
    public function summary(): ShareSummary
    {
        return new ShareSummary($this->id, $this->number, $this->state);
    }

    /**
     * What the requesting agent learns of its proposal: its number and state, nothing more.
     */
    public function proposalStatus(): ShareProposalStatus
    {
        return new ShareProposalStatus($this->number, $this->state);
    }

    public function root(): RecordIdentity
    {
        return new RecordIdentity($this->root_type, $this->root_id);
    }

    /**
     * Whether one of these users granted the share; a proposal was granted by nobody.
     *
     * @param  list<string>  $userIds
     */
    public function isGrantedByOneOf(array $userIds): bool
    {
        return $this->owner_user_id !== null && in_array($this->owner_user_id, $userIds, true);
    }

    // ----------[ Internals ]----------

    private static function forRoot(RecordIdentity $root, ShareState $state, CarbonImmutable $expiresAt): self
    {
        $share = new self();
        $share->state = $state;
        $share->root_type = $root->type;
        $share->root_id = $root->id;
        $share->scope_version = 0;
        $share->expires_at = $expiresAt;

        return $share;
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unended(Builder $query): void
    {
        $query->whereIn('state', array_map(fn (ShareState $state) => $state->value, ShareState::liveStates()));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function awaitingGateway(Builder $query): void
    {
        $query->whereIn(
            'state',
            [ShareState::Pending->value, ShareState::Failed->value],
        )->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, ShareState $state): void
    {
        $query->where('state', $state->value);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRootType(Builder $query, string $type): void
    {
        $query->where('root_type', $type);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function expiringBefore(Builder $query, CarbonImmutable $deadline): void
    {
        $query->where('expires_at', '<', $deadline);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function olderThan(Builder $query, string $id): void
    {
        $query->where('id', '<', $id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pastDeadline(Builder $query): void
    {
        $open = [ShareState::Proposed, ...ShareState::liveStates()];

        $query->whereIn(
            'state',
            array_map(fn (ShareState $state) => $state->value, $open),
        )->where('expires_at', '<=', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function servedBy(Builder $query, string $configurationId): void
    {
        $query->where('share_gateway_configuration_id', $configurationId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function proposedNow(Builder $query): void
    {
        $query->where('state', ShareState::Proposed->value)->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function requestedBy(Builder $query, ActorIdentity $requester): void
    {
        $query->where('requester_type', $requester->type->value)->where('requester_id', $requester->id);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function grantedByOwner(Builder $query, string $userId): void
    {
        $query->where('owner_user_id', $userId);
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function liveNow(Builder $query): void
    {
        $query->whereIn(
            'state',
            array_map(fn (ShareState $state) => $state->value, ShareState::liveStates()),
        )->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function openedByDigest(Builder $query, string $digest): void
    {
        $query->where('token_digest', $digest);
    }

    /**
     * What a lifecycle event tells about the share as it stands, at the moment the change was made.
     */
    private function factAt(CarbonImmutable $at): ShareFact
    {
        return new ShareFact($this->id, $this->share_gateway_configuration_id, $this->state, $this->scope_version, $at);
    }
}
