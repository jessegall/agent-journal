<?php

declare(strict_types=1);

namespace App\Models\Sessions;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Events\Sessions\SessionTokenIssued;
use App\Events\Sessions\SessionTokenRevoked;
use App\Events\Sessions\SessionTokenRotated;
use App\Models\Agents\AgentSession;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property string $id
 * @property string $agent_session_id
 * @property string $token_hash
 * @property CarbonImmutable|null $revoked_at
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 * @property-read AgentSession|null $session
 *
 * @mixin \Eloquent
 */
final class SessionToken extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'revoked_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Mutations ]----------

    /**
     * The token is issued for the session given, kept only as its hash.
     */
    public function issueFor(AgentSession $session, string $hash): void
    {
        $this->agent_session_id = $session->id;
        $this->token_hash = $hash;
        $this->saveAndAssert();
        $this->raise(new SessionTokenIssued($this->id, $session->id));
    }

    /**
     * Replaces the token: the old one stops working at once, and the session keeps its one credential row.
     */
    public function rotateTo(string $hash): void
    {
        $this->token_hash = $hash;
        $this->revoked_at = null;
        $this->saveAndAssert();
        $this->raise(new SessionTokenRotated($this->id));
    }

    /**
     * The token is revoked at the time given; it is refused from then on.
     */
    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->saveAndAssert();
        $this->raise(new SessionTokenRevoked($this->id));
    }

    // ----------[ Predicates ]----------

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    // ----------[ Relations ]----------

    /**
     * @return BelongsTo<AgentSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(AgentSession::class, 'agent_session_id');
    }
}
