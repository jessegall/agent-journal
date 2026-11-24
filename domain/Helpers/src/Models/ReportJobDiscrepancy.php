<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Contracts\Records\ReadableModel;
use App\Support\ActorIdentity;
use Carbon\CarbonImmutable;
use Domain\Helpers\Enums\ReportJobDiscrepancyReason;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;

/**
 * A report's claim to answer a helper job that was refused, kept for reconciliation: the report, the job its
 * session's start named, who filed it and why the claim failed.
 *
 * @property string $id
 * @property string $report_id
 * @property string $owner_reference
 * @property string $filer_type
 * @property string $filer_id
 * @property ReportJobDiscrepancyReason $reason
 * @property CarbonImmutable|null $created_at
 */
#[Table('report_job_discrepancies')]
#[Fillable(['report_id', 'owner_reference', 'filer_type', 'filer_id', 'reason'])]
final class ReportJobDiscrepancy extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'reason' => ReportJobDiscrepancyReason::class,
        ];
    }

    public static function create(
        string $reportId,
        string $ownerReference,
        ActorIdentity $filer,
        ReportJobDiscrepancyReason $reason,
    ): self {
        $discrepancy = new self([
            'report_id' => $reportId,
            'owner_reference' => $ownerReference,
            'filer_type' => $filer->type->value,
            'filer_id' => $filer->id,
            'reason' => $reason,
        ]);

        $discrepancy->save();

        return $discrepancy;
    }
}
