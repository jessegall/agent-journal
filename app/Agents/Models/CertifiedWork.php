<?php

declare(strict_types=1);

namespace App\Agents\Models;

use App\Agents\Exceptions\HelperWorkUncertified;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Records\Support\RecordIdentity;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
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
#[Fillable(['work_type', 'work_id', 'certificate', 'agent_session_id', 'worktree'])]
final class CertifiedWork extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    /**
     * Records the certificate of the start's work, with the checkout frozen in its session's policy; recording the
     * same certificate again finds the first.
     */
    public static function record(StartRecord $start, string $certificate): self
    {
        $work = $start->ownerWork();
        $policy = SessionPolicy::query()->where('session_id', $start->session_id)->sole();

        return self::query()->firstOrCreate(
            ['certificate' => $certificate],
            [
                'work_type' => $work->type,
                'work_id' => $work->id,
                'agent_session_id' => $start->session_id,
                'worktree' => $policy->execution_policy->worktree,
            ],
        );
    }

    /**
     * @throws HelperWorkUncertified
     */
    public static function of(RecordIdentity $work, string $certificate): self
    {
        return self::query()
            ->where('work_type', $work->type)
            ->where('work_id', $work->id)
            ->where('certificate', $certificate)
            ->firstOr(fn () => throw HelperWorkUncertified::for($work, $certificate));
    }

    /**
     * The parent repository's ref the commits are imported under: one per certificate, never a branch.
     */
    public function importRef(): string
    {
        return "refs/helpers/{$this->work_type}/{$this->work_id}/{$this->certificate}";
    }
}
