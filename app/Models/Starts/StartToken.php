<?php

declare(strict_types=1);

namespace App\Models\Starts;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Events\Sessions\StartTokenIssued;
use App\Events\Sessions\StartTokenRevoked;
use App\Events\Sessions\StartTokenRotated;
use App\Models\Agents\AgentSession;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * The credential one start signs in with. Only the hash of its token is kept.
 *
 * @property string $id
 * @property string $agent_session_id
 * @property string $token_hash
 * @property CarbonImmutable|null $revoked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AgentSession $session
 */
#[Fillable(['revoked_at'])]
final class StartToken extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
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

    public function issueFor(AgentSession $session, string $hash): void
    {
        $this->agent_session_id = $session->id;
        $this->token_hash = $hash;
        $this->assertSaved($this->save());
        $this->raise(new StartTokenIssued($this->id, $session->id));
    }

    /**
     * Replaces the token: the old one stops working at once, and the session keeps its one credential row.
     */
    public function rotateTo(string $hash): void
    {
        $this->token_hash = $hash;
        $this->revoked_at = null;
        $this->assertSaved($this->save());
        $this->raise(new StartTokenRotated($this->id));
    }

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->assertSaved($this->save());
        $this->raise(new StartTokenRevoked($this->id));
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
