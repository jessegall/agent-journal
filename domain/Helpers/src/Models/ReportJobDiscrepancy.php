<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use App\Support\ActorReference;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\ReportJobDiscrepancyReason;
use Illuminate\Database\Eloquent\Attributes\Table;

/**
 * @property string $id
 * @property string $report_id
 * @property string $owner_reference
 * @property string $filer_type
 * @property string $filer_id
 * @property ReportJobDiscrepancyReason $reason
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
#[Table('report_job_discrepancies')]
final class ReportJobDiscrepancy extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use Linkable;

    public const ?string UPDATED_AT = null;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'reason' => ReportJobDiscrepancyReason::class,
        ];
    }

    // ----------[ Constructors ]----------

    public static function create(
        string $reportId,
        string $ownerReference,
        ActorReference $filer,
        ReportJobDiscrepancyReason $reason,
    ): self {
        $discrepancy = new self();
        $discrepancy->report_id = $reportId;
        $discrepancy->owner_reference = $ownerReference;
        $discrepancy->filer_type = $filer->type;
        $discrepancy->filer_id = $filer->id;
        $discrepancy->reason = $reason;

        $discrepancy->save();

        return $discrepancy;
    }
}
