<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Connections\ProjectInvitationIssued;
use App\Events\Connections\ProjectInvitationRevoked;
use App\Events\Connections\ProjectInvitationSpent;
use App\Models\Support\JournalModel;
use App\Projects\Enums\InvitationMode;
use App\Projects\Exceptions\InvitationUnusable;
use App\Projects\Values\InstallTicket;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;

/**
 * @property string $id
 * @property string $ticket_digest
 * @property string $issuer_user_id
 * @property InvitationMode $mode
 * @property string|null $project_id
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $spent_at
 * @property string|null $binding_id
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property string|null $install_attempt_id
 * @property string|null $environment_id
 *
 * @mixin \Eloquent
 */
final class ProjectInvitation extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * How long an install line can be redeemed after it is issued.
     */
    public const int LIFETIME_MINUTES = 10;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'mode' => InvitationMode::class,
            'expires_at' => 'immutable_datetime',
            'revoked_at' => 'immutable_datetime',
            'spent_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * The attempt's line, kept by the digest of its ticket and expiring LIFETIME_MINUTES from now: for a new project,
     * or to join the attempt's project, issued by the attempt's owner.
     */
    public static function create(InstallAttempt $attempt, string $ticketDigest): self
    {
        $invitation = new self();
        $invitation->ticket_digest = $ticketDigest;
        $invitation->issuer_user_id = $attempt->owner_user_id;
        $invitation->mode = $attempt->mode;
        $invitation->project_id = $attempt->project_id;
        $invitation->environment_id = $attempt->environment_id;
        $invitation->install_attempt_id = $attempt->id;
        $invitation->expires_at = CarbonImmutable::now()->addMinutes(self::LIFETIME_MINUTES);
        $invitation->saveAndAssert();

        $invitation->raise(
            new ProjectInvitationIssued($invitation->id, $invitation->expires_at, CarbonImmutable::now()),
        );

        return $invitation;
    }

    // ----------[ Mutations ]----------

    public function revoke(): void
    {
        $this->revoked_at = CarbonImmutable::now();
        $this->saveAndAssert();
        $this->raise(new ProjectInvitationRevoked($this->id, $this->revoked_at));
    }

    /**
     * Records the one redemption of the line and the binding it made.
     */
    public function spendOn(ProjectBinding $binding): void
    {
        $this->spent_at = CarbonImmutable::now();
        $this->binding_id = $binding->id;
        $this->saveAndAssert();
        $this->raise(new ProjectInvitationSpent($this->id, $binding->id, $this->spent_at));
    }

    /**
     * Whether the line can still be redeemed at this server time: not revoked, not spent and not expired.
     */
    public function isRedeemableAt(CarbonImmutable $now): bool
    {
        return $this->revoked_at === null && $this->spent_at === null && $this->expires_at->isAfter($now);
    }

    // ----------[ Calculations ]----------

    /**
     * The id of the install attempt this line belongs to; reading it on a line issued before attempts existed, which
     * has none and cannot be used, fails.
     *
     * @throws InvitationUnusable
     */
    public function attemptId(): string
    {
        $this->assertHasAttempt();

        return $this->install_attempt_id;
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an invitation with no install attempt.
     *
     * @phpstan-assert !null $this->install_attempt_id
     *
     * @throws InvitationUnusable
     */
    private function assertHasAttempt(): void
    {
        if ($this->install_attempt_id === null) {
            throw InvitationUnusable::forId($this->id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The line this ticket opens, if it can still be redeemed now: unknown, expired, spent and revoked lines are
     * refused alike.
     *
     * @throws InvitationUnusable
     */
    public static function findRedeemableFor(string $ticket): self
    {
        return self::query()->pending()->withTicket($ticket)->firstOr(InvitationUnusable::throwing()->forTicket());
    }

    /**
     * The line this ticket opens, if it can still be redeemed now, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function findLockedRedeemableFor(string $ticket): self
    {
        return self::query()
            ->pending()
            ->withTicket($ticket)
            ->lockForUpdate()
            ->firstOr(InvitationUnusable::throwing()->forTicket());
    }

    /**
     * The attempt's line still pending, none or one, locked until the transaction ends.
     *
     * @return list<self>
     */
    public static function findLockedPendingOf(InstallAttempt $attempt): array
    {
        return array_values(self::query()->pending()->ofAttempt($attempt)->lockForUpdate()
            ->limit(1)->get()->all());
    }

    /**
     * The pending line of this id, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function findLockedPending(string $id): self
    {
        return self::query()
            ->pending()
            ->whereKey($id)
            ->lockForUpdate()
            ->firstOr(InvitationUnusable::throwing()->forId($id));
    }

    // ----------[ Scopes ]----------

    /**
     * Lines that can still be redeemed now: not revoked, not spent and not expired.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function pending(Builder $query): void
    {
        $query->whereNull('revoked_at')->whereNull('spent_at')->where('expires_at', '>', CarbonImmutable::now());
    }

    /**
     * The invitation the ticket redeems.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withTicket(Builder $query, string $ticket): void
    {
        $query->where('ticket_digest', InstallTicket::digestOf($ticket));
    }

    /**
     * The attempt's invitation.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofAttempt(Builder $query, InstallAttempt $attempt): void
    {
        $query->where('install_attempt_id', $attempt->id);
    }
}
