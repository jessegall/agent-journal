<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Enums\ActorType;
use App\Enums\ConversationModeType;
use App\Enums\DriverSourceType;
use App\Enums\ModelSelectionType;
use App\Enums\StartDisposition;
use App\Enums\StartOriginType;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\StartRecordDetails;
use Domain\Helpers\Enums\ReportJobDiscrepancyReason;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Models\ReportJobDiscrepancy;
use Domain\Helpers\Models\ReportJobLink;
use Domain\Helpers\Support\ReportJobLinkService;
use Domain\Helpers\Tests\TestCase;
use Domain\Helpers\Values\FiledReport;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A filed report is tied to the job its filing session was started for, not the helper's latest job; the same
 * filing ties once, a claim the job does not bear out is kept as a discrepancy, and a plain report stays untied.
 */
final class ReportJobLinkTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $parent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->parent = $this->actAsUser('parent');
    }

    public function test_a_late_filing_for_job_a_after_job_b_started_is_tied_to_a_once(): void
    {
        [$helper, $identity] = $this->helper();
        $first = $this->jobOf($identity);
        $this->jobOf($identity);
        $report = new FiledReport((string) Str::ulid(), 7);

        $this->linking()->link($report, $helper, $this->startFor($first, $helper));
        $this->linking()->link($report, $helper, $this->startFor($first, $helper));

        $this->assertSame($first->id, ReportJobLink::query()->sole()->helper_job_id);
    }

    public function test_a_filing_for_another_helpers_job_is_refused_and_kept_as_a_discrepancy(): void
    {
        [, $identity] = $this->helper();
        [$other] = $this->helper();
        $job = $this->jobOf($identity);
        $report = new FiledReport((string) Str::ulid(), 7);

        $this->linking()->link($report, $other, $this->startFor($job, $other));

        $this->assertSame(0, ReportJobLink::query()->count());

        $this->assertSame(
            ReportJobDiscrepancyReason::FilerMismatch,
            ReportJobDiscrepancy::query()->where('report_id', $report->id)->sole()->reason,
        );
    }

    public function test_a_start_for_other_work_leaves_the_report_plain(): void
    {
        [$helper] = $this->helper();
        $start = $this->start('tasks.task:'.Str::ulid(), $helper);

        $this->linking()->link(new FiledReport((string) Str::ulid(), 8), $helper, $start);

        $this->assertSame(0, ReportJobLink::query()->count());
        $this->assertSame(0, ReportJobDiscrepancy::query()->count());
    }

    /**
     * @return array{ActorIdentity, HelperIdentity}
     */
    private function helper(): array
    {
        $actor = ActorIdentity::of(Agent::create('Helper '.Str::random(6), 'writing-helper'));

        return [
            $actor,
            HelperIdentity::create($this->parent, $actor, 'writing-helper', 'writing-helper'),
        ];
    }

    private function jobOf(HelperIdentity $identity): HelperJob
    {
        $purpose = HelperPurpose::free($this->parent, 'writing-helper', 'General work '.Str::random(6));

        return HelperJob::create(
            $identity,
            $purpose,
            $this->parent,
            'Write it down',
            ['subjects' => []],
            self::launchFor((string) Str::ulid()),
        );
    }

    private function startFor(HelperJob $job, ActorIdentity $agent): StartRecordDetails
    {
        return $this->start(HelperJob::LINK_TYPE.':'.$job->id, $agent);
    }

    private function start(string $ownerReference, ActorIdentity $agent): StartRecordDetails
    {
        $this->assertSame(ActorType::Agent, $agent->type);

        return new StartRecordDetails(
            (string) Str::ulid(),
            $agent->id,
            'claude-code',
            'sonnet',
            ModelSelectionType::ProfileDefault,
            null,
            DriverSourceType::Profile,
            StartOriginType::OwnerRequest,
            $ownerReference,
            ConversationModeType::New,
            StartDisposition::Started,
            (string) Str::ulid(),
            null,
            null,
        );
    }

    private function linking(): ReportJobLinkService
    {
        return $this->app->make(ReportJobLinkService::class);
    }
}
