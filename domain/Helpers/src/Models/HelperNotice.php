<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Actors\Models\Support\BelongsToOneActor;
use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Domain\Helpers\Enums\JobState;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * What a parent is told when a helper's attempt at a job ended: the job, where it stands and what to run next. It is
 * kept for the parent actor, never for a session.
 *
 * @property string $id
 * @property string $helper_identity_id
 * @property string $helper_job_id
 * @property JobState $job_state
 * @property string $text
 */
#[Fillable(['job_state', 'text'])]
#[Table('helper_notices')]
final class HelperNotice extends Model implements ReadableModel
{
    use BelongsToOneActor, BoundedReads, HasUlids;
    use Linkable;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['job_state' => JobState::class];
    }

    public static function leave(HelperJob $job, string $text): self
    {
        $notice = new self();
        $notice->helper_identity_id = $job->helper_identity_id;
        $notice->helper_job_id = $job->id;
        $notice->job_state = $job->state;
        $notice->text = $text;
        $notice->belongTo($job->parent());
        $notice->save();

        return $notice;
    }
}
