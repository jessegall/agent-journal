<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Actors\Support\ActorIdentity;
use App\Agents\Models\Agent;
use App\Communication\Models\NotificationOccurrence;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use Domain\Helpers\Events\ReportJobLinked;
use Domain\Helpers\Listeners\DeliverReportReadyNotification;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A report tied to a job gives the job's recorded parent one report-ready receipt: a second job of the same helper
 * under another parent notifies that parent alone, and the same tie heard twice adds nothing.
 */
final class ReportReadyNotificationTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_each_report_reaches_the_parent_of_its_own_job_once(): void
    {
        $atlas = ActorIdentity::of(Agent::create('Atlas '.Str::random(6), 'main-agent'));
        $jo = $this->actAsUser('jo');
        $birch = HelperIdentity::create(
            $atlas,
            ActorIdentity::of(Agent::create('Birch '.Str::random(6), 'writing-helper')),
            'writing-helper',
            'writing-helper',
        );
        $forAtlas = $this->jobOf($birch, $atlas);
        $forJo = $this->jobOf($birch, $jo);

        $this->deliver(new ReportJobLinked((string) Str::ulid(), 12, $forAtlas->id));
        $linked = new ReportJobLinked((string) Str::ulid(), 13, $forJo->id);
        $this->deliver($linked);
        $this->deliver($linked);

        $this->assertSame(2, NotificationOccurrence::query()->count());
        $this->assertSame(['12'], $this->targetsOf($atlas));
        $this->assertSame(['13'], $this->targetsOf($jo));
    }

    private function jobOf(HelperIdentity $helper, ActorIdentity $parent): HelperJob
    {
        return HelperJob::create(
            $helper,
            HelperPurpose::free($parent, 'writing-helper', 'General work '.Str::random(6)),
            $parent,
            'Write it down',
            ['subjects' => []],
            self::launchFor((string) Str::ulid()),
        );
    }

    private function deliver(ReportJobLinked $fact): void
    {
        $this->app->make(DeliverReportReadyNotification::class)->handle($fact);
    }

    /**
     * @return list<string>
     */
    private function targetsOf(ActorIdentity $parent): array
    {
        $scope = NotificationScope::query()
            ->where('recipient_type', $parent->type->value)
            ->where('recipient_id', $parent->id)
            ->sole();

        return array_values(NotificationReceipt::query()
            ->where('scope_id', $scope->id)
            ->with('occurrence')
            ->get()
            ->map(fn (NotificationReceipt $receipt) => $receipt->occurrence->target_id)
            ->all());
    }
}
