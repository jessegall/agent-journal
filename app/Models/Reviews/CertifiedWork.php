<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\HelperWorkUncertified;
use App\Models\Starts\SessionPolicy;
use App\Models\Starts\StartRecord;
use App\Models\Support\HasWorkColumns;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The proof that one launch's work was certified complete by a passed stop, with the checkout it was done in. Only
 * work proved this way may have its commits imported by its parent.
 *
 * @property string $id
 * @property string $work_type
 * @property string $work_id
 * @property string $certificate
 * @property string $agent_session_id
 * @property string $worktree
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('certified_works')]
#[Fillable([
    'work_type',
    'work_id',
    'certificate',
    'agent_session_id',
    'worktree',
])]
final class CertifiedWork extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use HasWorkColumns;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Accessors ]----------

    /**
     * The parent repository's ref the commits are imported under: one per certificate, never a branch.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function importRef(): Attribute
    {
        return Attribute::get(fn () => "refs/helpers/{$this->work_type}/{$this->work_id}/{$this->certificate}");
    }

    // ----------[ Asserts ]----------

    // ----------[ Queries ]----------

    /**
     * Records the certificate of the start's work, with the checkout frozen in its session's policy; recording the
     * same certificate again finds the first.
     */
    public static function record(StartRecord $start, string $certificate): self
    {
        $work = $start->ownerWork();
        $policy = SessionPolicy::query()->ofSessions([$start->session_id])->sole();

        $certified = new self([
            'certificate' => $certificate,
            'work_type' => $work->type,
            'work_id' => $work->id,
            'agent_session_id' => $start->session_id,
            'worktree' => $policy->execution_policy->worktree,
        ]);

        $certified->setAttribute($certified->getKeyName(), $certified->newUniqueId());
        $certified->insertIfAbsent();

        return self::query()->withCertificate($certificate)->sole();
    }

    /**
     * @throws HelperWorkUncertified
     */
    public static function of(RecordIdentity $work, string $certificate): self
    {
        return self::query()
            ->ofWork($work)
            ->withCertificate($certificate)->firstOr(HelperWorkUncertified::throwing()->for($work, $certificate));
    }

    // ----------[ Scopes ]----------

    /**
     * The work the certificate certifies.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function withCertificate(Builder $query, string $certificate): void
    {
        $query->where('certificate', $certificate);
    }

    /**
     * The certifications of the work.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function ofWork(Builder $query, RecordIdentity $work): void
    {
        $query->where('work_type', $work->type)->where('work_id', $work->id);
    }
}
