<?php

declare(strict_types=1);

namespace Domain\Helpers\Models;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Domain\Helpers\Events\ReportJobLinked;
use Domain\Helpers\Values\FiledReport;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use PhpOption\Option;

/**
 * @property string $id
 * @property string $report_id
 * @property int $report_number
 * @property string $helper_job_id
 * @property string $dispatch_request_id
 * @property CarbonImmutable $verified_at
 * @property CarbonImmutable|null $created_at
 *
 * @mixin \Eloquent
 */
#[Table('report_job_links')]
final class ReportJobLink extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
    use Linkable;
    use RaisesEvents;

    public const ?string UPDATED_AT = null;

    /**
     * @return array<string, mixed>
     */
    protected function casts(): array
    {
        return [
            'report_number' => 'integer',
            'verified_at' => 'immutable_datetime',
        ];
    }

    // ----------[ Constructors ]----------

    /**
     * Ties the report to the job unless it is already tied; only the call that tied it raises the fact.
     */
    public static function create(FiledReport $report, HelperJob $job, string $dispatchRequestId): self
    {
        $link = new self();
        $link->report_id = $report->id;
        $link->report_number = $report->number;
        $link->helper_job_id = $job->id;
        $link->dispatch_request_id = $dispatchRequestId;
        $link->verified_at = CarbonImmutable::now();

        $link->id = $link->newUniqueId();

        if ($link->insertIfAbsent()) {
            $link->raise(new ReportJobLinked($report->id, $report->number, $job->id));
        }

        return $link;
    }

    // ----------[ Predicates ]----------

    public function isFor(HelperJob $job): bool
    {
        return $this->helper_job_id === $job->id;
    }

    // ----------[ Queries ]----------

    /**
     * The report's tie to a job, when it has one.
     *
     * @return Option<self>
     */
    public static function findForReport(string $reportId): Option
    {
        $reportJobLink = self::query()->forReport($reportId)->first();

        return Option::fromValue($reportJobLink);
    }

    // ----------[ Scopes ]----------

    /**
     * The report's link to its job.
     *
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function forReport(Builder $query, string $reportId): void
    {
        $query->where('report_id', $reportId);
    }
}
