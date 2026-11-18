<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Links\Support\Linkable;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * The credential one launch signs in with. Only the hash of its token is kept.
 *
 * @property int $id
 * @property int $agent_session_id
 * @property string $token_hash
 * @property CarbonImmutable|null $revoked_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read AgentSession $session
 */
#[Fillable(['revoked_at'])]
final class LaunchCredential extends Model
{
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'agent_session_id' => 'integer',
            'revoked_at' => 'immutable_datetime',
        ];
    }

    public function issueFor(AgentSession $session, string $tokenHash): void
    {
        $this->agent_session_id = $session->id;
        $this->token_hash = $tokenHash;
        $this->save();
    }

    public function revokeAt(CarbonImmutable $time): void
    {
        $this->revoked_at = $time;
        $this->save();
    }

    public function isRevoked(): bool
    {
        return $this->revoked_at !== null;
    }

    /**
     * @return BelongsTo<AgentSession, $this>
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(AgentSession::class, 'agent_session_id');
    }
}
