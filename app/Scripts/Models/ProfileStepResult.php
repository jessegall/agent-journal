<?php

declare(strict_types=1);

namespace App\Scripts\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Scripts\Enums\StepStatus;
use App\Scripts\Values\StepOutcome;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * The one recorded outcome of a step of a profile run: how it ended, the port it leaves by and its evidence.
 *
 * @property string $id
 * @property string $profile_run_id
 * @property string $step_reference
 * @property StepStatus $status
 * @property string|null $port
 * @property string|null $evidence
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Table('profile_step_results')]
#[Fillable(['profile_run_id', 'step_reference', 'status', 'port', 'evidence'])]
final class ProfileStepResult extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return ['status' => StepStatus::class];
    }

    public static function create(ProfileRun $run, string $reference, StepOutcome $outcome): self
    {
        $result = new self();
        $result->profile_run_id = $run->id;
        $result->step_reference = $reference;
        $result->status = $outcome->status;
        $result->port = $outcome->port;
        $result->evidence = $outcome->evidence;
        $result->save();

        return $result;
    }

    // ----------[ Answers ]----------

    public function outcome(): StepOutcome
    {
        return StepOutcome::reported($this->status, $this->port, $this->evidence);
    }
}
