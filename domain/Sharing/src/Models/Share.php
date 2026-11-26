<?php

declare(strict_types=1);

namespace Domain\Sharing\Models;

use App\Concerns\BoundedReads;
use App\Concerns\HasNumber;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Concerns\FindsForUpdate;
use App\Models\Support\Accessor;
use App\Models\Support\BelongsToOneRoot;
use App\Models\Support\BelongsToProjectOrGlobal;
use App\Models\Support\JournalModel;
use App\Projects\Contracts\ProjectOwned;
use App\Records\Contracts\Numbered;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\ProjectOwner;
use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareExpired;
use Domain\Sharing\Events\ShareFailed;
use Domain\Sharing\Events\SharePruned;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Events\ShareRetried;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Events\ShareScopeChanged;
use Domain\Sharing\Exceptions\ShareEndInvalid;
use Domain\Sharing\Exceptions\ShareGatewayUnavailable;
use Domain\Sharing\Exceptions\ShareProposalUnavailable;
use Domain\Sharing\Exceptions\ShareRetryRefused;
use Domain\Sharing\Support\ShareFact;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareListFilters;
use Domain\Sharing\Support\ShareProposal;
use Domain\Sharing\Support\ShareProposalStatus;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Support\ShareToken;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use PhpOption\None;
use PhpOption\Option;

/**
 * @property string $id
 * @property string|null $project_id
 * @property string $number_group_id
 * @property int $number
 * @property ShareStatus $status
 * @property string $root_type
 * @property string $root_id
 * @property string|null $owner_user_id
 * @property string|null $requester_type
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
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read mixed $fact
 * @property-read mixed $proposal_status
 * @property-read mixed $root
 * @property-read mixed $summary
 *
 * @mixin \Eloquent
 */
#[Hidden(['token_digest', 'token_ciphertext'])]
final class Share extends JournalModel implements EventSource, Numbered, ProjectOwned, ReadableModel
{
    use BelongsToOneRoot;
    use BelongsToProjectOrGlobal;
    use BoundedReads;
    use FindsForUpdate;
    use HasNumber;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

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

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ShareStatus::class,
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

    // ----------[ Constructors ]----------

    /**
     * A share of the root, of the root's owner, until its expiry. From an agent's request it is a proposal with no
     * token and no gateway, kept until the owner approves it or it expires; from the owner's grant it holds a new token
     * under a gateway configuration at its first scope version, waiting for its gateway.
     */
    public static function create(
        RecordIdentity $root,
        ProjectOwner $rootOwner,
        CarbonImmutable $expiresAt,
        ShareProposal|ShareGrant $origin,
    ): self {
        if ($origin instanceof ShareProposal) {
            $share = self::forRoot($root, $rootOwner, ShareStatus::Proposed, $expiresAt);
            $share->requester_type = $origin->requester->type;
            $share->requester_id = $origin->requester->id;
            $share->saveAndAssert();
            $share->raise(new ShareRequested($share->fact));

            return $share;
        }

        $share = self::forRoot($root, $rootOwner, ShareStatus::Pending, $expiresAt);
        $share->owner_user_id = $origin->ownerUserId;
        $share->scope_version = self::FIRST_SCOPE_VERSION;
        $share->share_gateway_configuration_id = $origin->configurationId;
        $share->configuration_version = $origin->configurationVersion;
        $share->token_digest = $origin->token->digest;
        $share->token_ciphertext = $origin->token->token;
        $share->saveAndAssert();
        $share->raise(new ShareCreated($share->fact));

        return $share;
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
        $this->status = ShareStatus::Pending;
        $this->owner_user_id = $ownerUserId;
        $this->scope_version = self::FIRST_SCOPE_VERSION;
        $this->expires_at = $expiresAt;
        $this->share_gateway_configuration_id = $configuration->id;
        $this->configuration_version = $configuration->configuration_version;
        $this->token_digest = $token->digest;
        $this->token_ciphertext = $token->token;
        $this->saveAndAssert();
        $this->raise(new ShareCreated($this->fact));
    }

    /**
     * Ends the share as revoked or expired once and raises that fact; false, with nothing changed, when it had already
     * ended. Its token can no longer be read back, while its digest stays so a read with the old token is denied.
     *
     * @throws ShareEndInvalid
     */
    public function end(ShareStatus $terminal): bool
    {
        $this->assertEndsAs($terminal);

        if ($this->status->isTerminal()) {
            return false;
        }

        $endedAt = CarbonImmutable::now();
        $this->status = $terminal;
        $this->terminal_at = $endedAt;
        $this->token_ciphertext = null;
        $this->saveAndAssert();

        if ($terminal === ShareStatus::Revoked) {
            $this->raise(new ShareRevoked($this->factAt($endedAt)));

            return true;
        }

        $this->raise(new ShareExpired($this->factAt($endedAt)));

        return true;
    }

    /**
     * Moves the share to its next scope version, whose members are approved next; earlier members stop counting.
     */
    public function advanceScope(): void
    {
        $this->scope_version++;
        $this->saveAndAssert();
        $this->raise(new ShareScopeChanged($this->fact));
    }

    /**
     * Puts a pending or failed share back to waiting for its gateway, keeping its token and deadline.
     *
     * @throws ShareRetryRefused when the share may not be retried or its deadline passed
     */
    public function retryOpening(): void
    {
        $this->assertRetryable();

        $this->status = ShareStatus::Pending;
        $this->save();
        $this->raise(new ShareRetried($this->factAt(CarbonImmutable::now())));
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
        $this->raise(new SharePruned($this->id, $at));
    }

    /**
     * Its gateway serves it now.
     */
    public function activate(): void
    {
        $this->status = ShareStatus::Active;
        $this->saveAndAssert();
        $this->raise(new ShareActivated($this->fact));
    }

    /**
     * Its gateway could not open; the owner may retry before the deadline.
     */
    public function failActivation(): void
    {
        $this->status = ShareStatus::Failed;
        $this->saveAndAssert();
        $this->raise(new ShareFailed($this->fact));
    }

    // ----------[ Predicates ]----------

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
        return $this->status === ShareStatus::Active && $this->expires_at->isFuture();
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

    // ----------[ Transformers ]----------

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

        $shareGatewayConfiguration = ShareGatewayConfiguration::query()->findOrFail(
            $this->share_gateway_configuration_id,
        );

        return ShareGatewayEndpoint::findNewestRunningOf(
            $shareGatewayConfiguration,
        );
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

    // ----------[ Calculations ]----------

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
     * The id of the gateway configuration the owner's grant is served under; reading it on a proposal, which has no
     * gateway yet, fails.
     *
     * @throws ShareGatewayUnavailable
     */
    public function gatewayConfigurationId(): string
    {
        $this->assertHasGateway();

        return $this->share_gateway_configuration_id;
    }

    // ----------[ Accessors ]----------

    /**
     * What a lifecycle event tells about the share as it stands now.
     *
     * @return Attribute<ShareFact, never>
     */
    protected function fact(): Attribute
    {
        return Accessor::get(fn () => $this->factAt(CarbonImmutable::now()));
    }

    /**
     * What the owner learns of the share: its id, number and state, never its token.
     *
     * @return Attribute<ShareSummary, never>
     */
    protected function summary(): Attribute
    {
        return Accessor::get(fn () => new ShareSummary($this->id, $this->number, $this->status));
    }

    /**
     * What the requesting agent learns of its proposal: its number and state, nothing more.
     *
     * @return Attribute<ShareProposalStatus, never>
     */
    protected function proposalStatus(): Attribute
    {
        return Accessor::get(fn () => new ShareProposalStatus($this->number, $this->status));
    }

    /**
     * @return Attribute<RecordIdentity, never>
     */
    protected function root(): Attribute
    {
        return Accessor::get(fn () => new RecordIdentity($this->root_type, $this->root_id));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an end that is neither a revoke nor an expiry.
     *
     * @throws ShareEndInvalid
     */
    private function assertEndsAs(ShareStatus $terminal): void
    {
        if ($terminal !== ShareStatus::Revoked && $terminal !== ShareStatus::Expired) {
            throw ShareEndInvalid::for($this->id, $terminal);
        }
    }

    /**
     * Refuses a retry of a share whose state allows none, or that has expired.
     *
     * @throws ShareRetryRefused
     */
    private function assertRetryable(): void
    {
        if (! $this->expires_at->isFuture()) {
            throw ShareRetryRefused::for($this->id, ShareStatus::Expired);
        }

        if (! $this->status->mayRetry()) {
            throw ShareRetryRefused::for($this->id, $this->status);
        }
    }

    /**
     * Refuses a share proposed with no gateway configuration.
     *
     * @phpstan-assert !null $this->share_gateway_configuration_id
     *
     * @throws ShareGatewayUnavailable
     */
    private function assertHasGateway(): void
    {
        if ($this->share_gateway_configuration_id === null) {
            throw ShareGatewayUnavailable::forProposal($this->id);
        }
    }

    // ----------[ Internals ]----------

    private static function forRoot(
        RecordIdentity $root,
        ProjectOwner $owner,
        ShareStatus $status,
        CarbonImmutable $expiresAt,
    ): self {
        $share = new self();
        $share->assignOwner($owner);
        $share->status = $status;
        $share->root_type = $root->type;
        $share->root_id = $root->id;
        $share->scope_version = 0;
        $share->expires_at = $expiresAt;

        return $share;
    }

    // ----------[ Queries ]----------

    /**
     * The proposals and live shares whose deadline has passed but whose state has not caught up, oldest first and
     * locked, at most the given number.
     *
     * @return list<self>
     */
    public static function findLockedPastDeadline(int $most): array
    {
        return array_values(
            self::query()->pastDeadline()->oldestFirst()->lockForUpdate()->readExactly($most)->get()->all(),
        );
    }

    /**
     * The configuration's unexpired shares waiting for their gateway or failed on it, by id and locked.
     *
     * @return list<self>
     */
    public static function findLockedAwaitingGatewayOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->awaitingGateway()->oldestFirst()->lockForUpdate()->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The gateway configurations that serve at least one share still live and unexpired: what a new supervisor run
     * opens again. Proposals and ended shares never open a tunnel.
     *
     * @return list<string>
     */
    public static function resolveReopenableConfigurations(): array
    {
        return array_values(
            array_unique(
                array_map(
                    strval(...),
                    self::query()->liveNow()->throughGateway()->readExactly(
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
    public static function findUnendedOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->unended()->oldestFirst()->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * Every share the configuration's gateway serves that has not ended, whatever its deadline, by id and locked.
     *
     * @return list<self>
     */
    public static function findLockedUnendedOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->unended()->oldestFirst()->lockForUpdate()->readExactly(
                self::LIVE_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The configuration's pending shares, by id and locked.
     *
     * @return list<self>
     */
    public static function findLockedPendingOf(string $configurationId): array
    {
        return array_values(
            self::query()->servedBy($configurationId)->inState(
                ShareStatus::Pending,
            )->oldestFirst()->lockForUpdate()->limit(self::LIVE_LIMIT)->get()->all(),
        );
    }

    /**
     * Whether any live, unexpired share is served by the configuration.
     */
    public static function hasAnyLiveOn(string $configurationId): bool
    {
        return self::query()->liveNow()->servedBy($configurationId)->exists();
    }

    /**
     * How many unexpired proposals the installation holds now; counted under the installation lock.
     */
    public static function resolveProposedCount(): int
    {
        return self::query()->proposedNow()->count();
    }

    /**
     * The unexpired proposal of this id, locked until the transaction ends.
     *
     * @throws ShareProposalUnavailable
     */
    public static function findLockedProposal(string $id): self
    {
        return self::query()
            ->whereKey($id)
            ->proposedNow()
            ->lockForUpdate()
            ->firstOr(ShareProposalUnavailable::throwing()->for($id));
    }

    /**
     * The actor's newest proposals, whatever became of them.
     *
     * @return list<self>
     */
    public static function findProposedBy(ActorReference $requester): array
    {
        return array_values(
            self::query()->requestedBy($requester)->newestFirst()->limit(self::PROPOSED_LIMIT)->get()->all(),
        );
    }

    /**
     * The newest live, unexpired share of the root, if it has one.
     *
     * @return Option<self>
     */
    public static function findLiveFor(RecordIdentity $root): Option
    {
        $share = self::query()->ofRoot($root)->liveNow()->newestFirst()->first();

        return Option::fromValue($share);
    }

    /**
     * The current scope version of each of these shares that is live and unexpired, by share id.
     *
     * @param  list<string>  $ids
     * @return array<string, int>
     */
    public static function resolveLiveScopeVersions(array $ids): array
    {
        return self::query()->whereKey($ids)->liveNow()->readExactly(count($ids))->pluck('scope_version', 'id')->map(
            fn (mixed $version) => (int) $version,
        )->all();
    }

    /**
     * How many live, unexpired shares the installation holds now, whatever their state column has caught up with;
     * counted under the installation lock.
     */
    public static function resolveLiveCount(): int
    {
        return self::query()->liveNow()->count();
    }

    /**
     * One page of shares and proposals, newest first, narrowed by the owner's filters; one more row than the page
     * holds is read so the caller knows whether another page follows.
     *
     * @return list<self>
     */
    public static function findListPage(ShareListFilters $filters, int $rows): array
    {
        $shares = self::query()->newestFirst()->filteredBy($filters)->readExactly($rows + 1)->get();

        return array_values($shares->all());
    }

    /**
     * The share of this id, if there is one.
     *
     * @return Option<self>
     */
    public static function findById(string $id): Option
    {
        $share = self::query()->whereKey($id)->first();

        return Option::fromValue($share);
    }

    /**
     * The open proposals of the root, newest first.
     *
     * @return list<self>
     */
    public static function findOpenProposalsFor(RecordIdentity $root): array
    {
        return array_values(
            self::query()->ofRoot($root)->proposedNow()->newestFirst()->readExactly(
                self::PROPOSED_LIMIT,
            )->get()->all(),
        );
    }

    /**
     * The share of this id granted by the owner, if there is one.
     *
     * @return Option<self>
     */
    public static function findGrantedBy(string $ownerUserId, string $id): Option
    {
        $share = self::query()->whereKey($id)->grantedByOwner($ownerUserId)->first();

        return Option::fromValue($share);
    }

    /**
     * The share a token digest opens, with only its id, state, scope version and deadline: the one query the public
     * bridge runs, as the system, before any read.
     *
     * @return Option<self>
     */
    public static function findForTokenDigest(string $digest): Option
    {
        $share = self::query()->acrossProjects()->openedByDigest($digest)->first([
            'id',
            'status',
            'scope_version',
            'expires_at',
        ]);

        return Option::fromValue(
            $share,
        );
    }

    /**
     * The share locked for reading until the transaction ends: readers share the lock, while a revoke or a scope
     * change waits for them.
     */
    public static function findLockedForRead(string $id): self
    {
        return self::query()->whereKey($id)->sharedLock()->firstOrFail();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function unended(Builder $query): void
    {
        $query->whereIn('status', array_map(fn (ShareStatus $status) => $status->value, ShareStatus::liveStates()));
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function awaitingGateway(Builder $query): void
    {
        $query->whereIn(
            'status',
            [ShareStatus::Pending->value, ShareStatus::Failed->value],
        )->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, ShareStatus $status): void
    {
        $query->where('status', $status->value);
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
        $open = [ShareStatus::Proposed, ...ShareStatus::liveStates()];

        $query->whereIn(
            'status',
            array_map(fn (ShareStatus $status) => $status->value, $open),
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
        $query->where('status', ShareStatus::Proposed->value)->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function requestedBy(Builder $query, ActorReference $requester): void
    {
        $query->where('requester_type', $requester->type)->where('requester_id', $requester->id);
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
            'status',
            array_map(fn (ShareStatus $status) => $status->value, ShareStatus::liveStates()),
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
        return new ShareFact($this->id, $this->share_gateway_configuration_id, $this->status, $this->scope_version, $at);
    }

    /**
     * The shares that ended before that moment.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function endedBy(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->whereNotNull('terminal_at')->where('terminal_at', '<', $cutoff);
    }

    /**
     * The shares served through a gateway configuration.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function throughGateway(Builder $query): void
    {
        $query->whereNotNull('share_gateway_configuration_id');
    }

    /**
     * The shares the list filters keep: each filter that is set narrows them.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function filteredBy(Builder $query, ShareListFilters $filters): void
    {
        $query->when($filters->status, fn (Builder $kept, ShareStatus $status) => $kept->inState($status))
            ->when($filters->rootType, fn (Builder $kept, string $type) => $kept->ofRootType($type))
            ->when($filters->configurationId, fn (Builder $kept, string $id) => $kept->servedBy($id))
            ->when($filters->expiresBefore, fn (Builder $kept, CarbonImmutable $by) => $kept->expiringBefore($by))
            ->when($filters->after, fn (Builder $kept, string $id) => $kept->olderThan($id));
    }

    /**
     * The ids of the shares that ended before the cutoff, as a subquery.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function endedBefore(Builder $query, CarbonImmutable $cutoff): void
    {
        $query->endedBy($cutoff)->select('id');
    }
}
