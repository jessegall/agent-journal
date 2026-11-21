<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Contracts\EventSource;
use App\Contracts\Support\RaisesEvents;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use Carbon\CarbonImmutable;
use Domain\Helpers\Events\ReportJobLinked;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use PhpOption\Option;

/**
 * That one filed report answers one helper job, verified at filing against the start of the session that filed it.
 * It is never changed: a report is tied once.
 *
 * @property string $id
 * @property string $report_id
 * @property string $helper_job_id
 * @property string $dispatch_request_id
 * @property CarbonImmutable $verified_at
 * @property CarbonImmutable|null $created_at
 */
#[Table('report_job_links')]
#[Fillable(['report_id', 'helper_job_id', 'dispatch_request_id', 'verified_at'])]
final class ReportJobLink extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use RaisesEvents;

    public const ?string UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'verified_at' => 'immutable_datetime',
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * Ties the report to the job unless it is already tied; only the call that tied it raises the fact.
     */
    public static function create(string $reportId, HelperJob $job, string $dispatchRequestId): self
    {
        $link = new self([
            'report_id' => $reportId,
            'helper_job_id' => $job->id,
            'dispatch_request_id' => $dispatchRequestId,
            'verified_at' => CarbonImmutable::now(),
        ]);

        $link->id = $link->newUniqueId();

        if ($link->insertIfAbsent()) {
            $link->raise(new ReportJobLinked($reportId, $job->id));
        }

        return $link;
    }

    // ----------[ Queries ]----------

    /**
     * The report's tie to a job, when it has one.
     *
     * @return Option<self>
     */
    public static function ofReport(string $reportId): Option
    {
        return Option::fromValue(self::query()->where('report_id', $reportId)->first());
    }

    // ----------[ Answers ]----------

    public function isFor(HelperJob $job): bool
    {
        return $this->helper_job_id === $job->id;
    }
}
