<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Enums\Skills\ReadEvidence;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property string $session_id
 * @property int $context_epoch
 * @property string $skill_key
 * @property string $content_digest
 * @property ReadEvidence $evidence
 * @property CarbonImmutable $read_at
 *
 * @mixin \Eloquent
 */
final class SkillReceipt extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use InsertsAbsentRows;
    use Linkable;

    public const string CREATED_AT = 'read_at';

    public const null UPDATED_AT = null;

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

    // ----------[ Queries ]----------

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
        $receipt = new self();
        $receipt->session_id = $sessionId;
        $receipt->context_epoch = $epoch;
        $receipt->skill_key = $skillKey;
        $receipt->content_digest = $digest;
        $receipt->evidence = $evidence;

        $receipt->setAttribute($receipt->getKeyName(), $receipt->newUniqueId());

        if ($receipt->insertIfAbsent()) {
            return $receipt;
        }

        return self::query()
            ->ofRead($sessionId, $epoch, $skillKey, $digest)
            ->sole();
    }

    /**
     * Whether the session read this text of the skill in its current context.
     */
    public static function hasRead(string $sessionId, string $skillKey, string $digest): bool
    {
        $epoch = SkillContextEpoch::currentOf($sessionId);

        return self::query()->ofRead($sessionId, $epoch, $skillKey, $digest)->exists();
    }

    // ----------[ Scopes ]----------

    /**
     * The session's read of the skill's content in that context epoch.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofRead(Builder $query, string $sessionId, int $epoch, string $skillKey, string $digest): void
    {
        $query->where('session_id', $sessionId)
            ->where('context_epoch', $epoch)
            ->where('skill_key', $skillKey)
            ->where('content_digest', $digest);
    }
}
