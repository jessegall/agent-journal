<?php

declare(strict_types=1);

namespace App\Connections\Models;

use App\Connections\Enums\InvitationMode;
use App\Connections\Events\ProjectInvitationIssued;
use App\Connections\Events\ProjectInvitationRevoked;
use App\Connections\Events\ProjectInvitationSpent;
use App\Connections\Exceptions\InvitationUnusable;
use App\Connections\Values\InstallTicket;
use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * A one-time install line the owner issued: the digest of its ticket, never the ticket, who issued it, whether it
 * connects a new project or joins one, when it expires and whether it was revoked or spent on a binding.
 *
 * @property string $id
 * @property string $ticket_digest
 * @property string $issuer_user_id
 * @property InvitationMode $mode
 * @property string|null $project_id
 * @property string $issuance_key
 * @property CarbonImmutable $expires_at
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $spent_at
 * @property string|null $binding_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['ticket_digest', 'issuer_user_id', 'mode', 'project_id', 'issuance_key', 'expires_at'])]
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

    // ----------[ Constructors ]----------

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

    /**
     * An install line for a new project, kept by the digest of its ticket and expiring LIFETIME_MINUTES from now.
     * The issuance key names the owner action it was issued for.
     */
    public static function issueForNewProject(string $ticketDigest, string $issuerUserId, string $issuanceKey): self
    {
        return self::issue($ticketDigest, $issuerUserId, InvitationMode::New, null, $issuanceKey);
    }

    /**
     * An install line that joins its folder to a project already connected.
     */
    public static function issueToJoin(
        Project $project,
        string $ticketDigest,
        string $issuerUserId,
        string $issuanceKey,
    ): self {
        return self::issue($ticketDigest, $issuerUserId, InvitationMode::Join, $project->id, $issuanceKey);
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
        return self::query()->pending()->where('ticket_digest', InstallTicket::digestOf($ticket))
            ->firstOr(fn () => throw InvitationUnusable::forTicket());
    }

    /**
     * The line this ticket opens, if it can still be redeemed now, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function lockRedeemableFor(string $ticket): self
    {
        return self::query()->pending()->where('ticket_digest', InstallTicket::digestOf($ticket))->lockForUpdate()
            ->firstOr(fn () => throw InvitationUnusable::forTicket());
    }

    /**
     * The lines still pending under an owner action's issuance key, locked until the transaction ends.
     *
     * @return list<self>
     */
    public static function lockPendingUnder(string $issuanceKey): array
    {
        return array_values(self::query()->pending()->where('issuance_key', $issuanceKey)->lockForUpdate()
            ->readAll('one owner action issues a line or two')->get()->all());
    }

    /**
     * The pending line of this id, locked until the transaction ends.
     *
     * @throws InvitationUnusable
     */
    public static function lockPending(string $id): self
    {
        return self::query()->pending()->whereKey($id)->lockForUpdate()
            ->firstOr(fn () => throw InvitationUnusable::forId($id));
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

    // ----------[ Internals ]----------

    private static function issue(
        string $ticketDigest,
        string $issuerUserId,
        InvitationMode $mode,
        string|null $projectId,
        string $issuanceKey,
    ): self {
        $invitation = new self();
        $invitation->ticket_digest = $ticketDigest;
        $invitation->issuer_user_id = $issuerUserId;
        $invitation->mode = $mode;
        $invitation->project_id = $projectId;
        $invitation->issuance_key = $issuanceKey;
        $invitation->expires_at = CarbonImmutable::now()->addMinutes(self::LIFETIME_MINUTES);
        $invitation->assertSaved($invitation->save());
        $invitation->raise(
            new ProjectInvitationIssued($invitation->id, $invitation->expires_at, CarbonImmutable::now()),
        );

        return $invitation;
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
}
