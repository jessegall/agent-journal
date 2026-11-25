<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Enums\InvitationMode;
use App\Events\Connections\ProjectInvitationIssued;
use App\Events\Connections\ProjectInvitationRevoked;
use App\Events\Connections\ProjectInvitationSpent;
use App\Exceptions\InvitationUnusable;
use App\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A one-time install line the owner issued for one install attempt: the digest of its ticket, never the ticket, who
 * issued it, whether it connects a new project or joins one, when it expires and whether it was revoked or spent on a
 * binding. An attempt has at most one live line.
 *
 * @property string $id
 * @property string $ticket_digest
 * @property string $issuer_user_id
 * @property InvitationMode $mode
 * @property string|null $project_id
 * @property string|null $environment_id
 * @property string|null $install_attempt_id
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $spent_at
 * @property string|null $binding_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'ticket_digest',
    'issuer_user_id',
    'mode',
    'project_id',
    'environment_id',
    'install_attempt_id',
    'expires_at',
])]
final class ProjectInvitation extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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
        $invitation->assertSaved($invitation->save());

        $invitation->raise(
            new ProjectInvitationIssued($invitation->id, $invitation->expires_at, CarbonImmutable::now()),
        );

        return $invitation;
    }

    // ----------[ Mutations ]----------

    public function revoke(): void
    {
        $this->revoked_at = CarbonImmutable::now();
        $this->assertSaved($this->save());
        $this->raise(new ProjectInvitationRevoked($this->id, $this->revoked_at));
    }

    /**
     * Records the one redemption of the line and the binding it made.
     */
    public function spendOn(ProjectBinding $binding): void
    {
        $this->spent_at = CarbonImmutable::now();
        $this->binding_id = $binding->id;
        $this->assertSaved($this->save());
        $this->raise(new ProjectInvitationSpent($this->id, $binding->id, $this->spent_at));
    }

    /**
     * Whether the line can still be redeemed at this server time: not revoked, not spent and not expired.
     */
    public function isRedeemableAt(CarbonImmutable $now): bool
    {
        return $this->revoked_at === null && $this->spent_at === null && $this->expires_at->isAfter($now);
    }

    // ----------[ Getters ]----------

    /**
     * The install attempt this line belongs to, locked until the transaction ends; a line issued before attempts
     * existed has none and cannot be used.
     *
     * @throws InvitationUnusable
     */
    public function lockAttempt(): InstallAttempt
    {
        $this->assertHasAttempt();

        return InstallAttempt::lockById($this->install_attempt_id);
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses a ticket no pending invitation holds.
     *
     * @phpstan-assert self $row
     *
     * @throws InvitationUnusable
     */
    private static function assertTicketUsable(self|null $row): void
    {
        if ($row === null) {
            throw InvitationUnusable::forTicket();
        }
    }

    /**
     * Refuses an invitation that is not pending.
     *
     * @phpstan-assert self $row
     *
     * @throws InvitationUnusable
     */
    private static function assertPending(self|null $row, string $id): void
    {
        if ($row === null) {
            throw InvitationUnusable::forId($id);
        }
    }

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
    public static function redeemableFor(string $ticket): self
    {
        $row = self::query()->pending()->withTicket($ticket)->first();
        self::assertTicketUsable($row);

        return $row;
    }

    /**
     * The line this ticket opens, if it can still be redeemed now, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function lockRedeemableFor(string $ticket): self
    {
        $row = self::query()->pending()->withTicket($ticket)->lockForUpdate()->first();
        self::assertTicketUsable($row);

        return $row;
    }

    /**
     * The attempt's line still pending, none or one, locked until the transaction ends.
     *
     * @return list<self>
     */
    public static function lockPendingOf(InstallAttempt $attempt): array
    {
        return array_values(self::query()->pending()->ofAttempt($attempt)->lockForUpdate()
            ->limit(1)->get()->all());
    }

    /**
     * The pending line of this id, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function lockPending(string $id): self
    {
        $row = self::query()->pending()->whereKey($id)->lockForUpdate()->first();
        self::assertPending($row, $id);

        return $row;
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
