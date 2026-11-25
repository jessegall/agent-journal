<?php

declare(strict_types=1);

namespace App\Models\Reviews;

use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Exceptions\HelperWorkUncertified;
use App\Models\Sessions\SessionPolicy;
use App\Models\Sessions\SessionRequest;
use App\Models\Support\Accessor;
use App\Models\Support\HasWorkColumns;
use App\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property string $id
 * @property string $work_type
 * @property string $work_id
 * @property string $certificate
 * @property string $agent_session_id
 * @property string $worktree
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $import_ref attribute
 */
#[Table('certified_works')]
final class CertifiedWork extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use HasWorkColumns;
    use InsertsAbsentRows;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * Records the certificate of the start's work, with the checkout frozen in its session's policy; recording the
     * same certificate again finds the first.
     */
    public static function create(SessionRequest $start, string $certificate): self
    {
        $work = $start->owner_work;
        $policy = SessionPolicy::query()->ofSessions([$start->session_id])->sole();

        $certified = new self();
        $certified->certificate = $certificate;
        $certified->work_type = $work->type;
        $certified->work_id = $work->id;
        $certified->agent_session_id = $start->session_id;
        $certified->worktree = $policy->execution_policy->worktree;

        $certified->setAttribute($certified->getKeyName(), $certified->newUniqueId());
        $certified->insertIfAbsent();

        return self::query()->withCertificate($certificate)->sole();
    }

    // ----------[ Accessors ]----------

    /**
     * The parent repository's ref the commits are imported under: one per certificate, never a branch.
     *
     * @return Attribute<non-falsy-string, never>
     */
    protected function importRef(): Attribute
    {
        return Accessor::get(fn () => "refs/helpers/{$this->work_type}/{$this->work_id}/{$this->certificate}");
    }

    // ----------[ Queries ]----------

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
