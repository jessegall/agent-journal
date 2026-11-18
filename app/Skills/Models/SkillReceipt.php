<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Skills\Enums\ReadEvidence;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * Proof that a session read one skill's delivered text whole in one context. It never changes which skills apply.
 *
 * @property string $id
 * @property string $session_id
 * @property int $context_epoch
 * @property string $skill_key
 * @property string $content_digest
 * @property ReadEvidence $evidence
 * @property CarbonImmutable $read_at
 */
#[Fillable(['session_id', 'context_epoch', 'skill_key', 'content_digest', 'evidence', 'read_at'])]
final class SkillReceipt extends Model implements ReadableModel
{
    use BoundedReads, HasUlids;

    public $timestamps = false;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'context_epoch' => 'integer',
            'evidence' => ReadEvidence::class,
            'read_at' => 'immutable_datetime',
        ];
    }

    /**
     * Records the read once per session, context, skill and text.
     */
    public static function record(
        string $sessionId,
        int $epoch,
        string $skillKey,
        string $digest,
        ReadEvidence $evidence,
    ): self {
        return self::query()->firstOrCreate(
            ['session_id' => $sessionId, 'context_epoch' => $epoch, 'skill_key' => $skillKey, 'content_digest' => $digest],
            ['evidence' => $evidence, 'read_at' => CarbonImmutable::now()],
        );
    }

    /**
     * Whether the session read this text of the skill in its current context.
     */
    public static function hasRead(string $sessionId, string $skillKey, string $digest): bool
    {
        return self::query()
            ->where('session_id', $sessionId)
            ->where('context_epoch', SkillContextEpoch::currentOf($sessionId))
            ->where('skill_key', $skillKey)
            ->where('content_digest', $digest)
            ->exists();
    }
}
