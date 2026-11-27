<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Events\Connections\DriverImageAdmitted;
use App\Events\Connections\DriverImageRefused;
use App\Hosts\Enums\DriverImagePhase;
use App\Hosts\Enums\DriverImageStatus;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use App\Models\Projects\HostDriverImageWait;
use Illuminate\Database\UniqueConstraintViolationException;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host keeps one row per driver image recipe, which only the instruction of its present phase moves: built, allowed,
 * checked, ready; refused for good for a bad recipe or its third failed recovery in a row, and counted from nothing
 * again once ready. A start waits on it once.
 */
#[TestsMachinery(HostDriverImage::class)]
final class HostDriverImageTest extends TestCase
{
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    private const string IMAGE = 'sha256:1111111111111111111111111111111111111111111111111111111111111111';

    private Host $host;

    private DriverImageRecipeRecord $recipe;

    protected function setUp(): void
    {
        parent::setUp();

        $box = $this->journal->enrollContainedHost('Box', ['/work'])->hostCalled('Box');
        $this->host = Host::query()->findOrFail($box->hostId);
        $recipe = DriverImageRecipe::of('d', ['Dockerfile' => 'FROM x'], 'base@sha256:a', '1.0.0');
        $this->recipe = DriverImageRecipeRecord::keep($recipe);
    }

    public function test_a_host_keeps_one_row_per_recipe(): void
    {
        $first = HostDriverImage::reserve($this->host, $this->recipe);
        $second = HostDriverImage::reserve($this->host, $this->recipe);

        $this->assertSame([$first->id, DriverImageStatus::Pending], [$second->id, $second->status]);
        $this->assertTrue($this->recipe->isDemanded());
    }

    public function test_only_the_present_phases_instruction_moves_the_row_to_ready(): void
    {
        $image = HostDriverImage::reserve($this->host, $this->recipe);

        $image->startAttempt('build-1');
        $staleBuild = $image->isCurrent('build-0', DriverImagePhase::Build);
        $image->built(self::IMAGE);
        $image->orderedIn('allow-1');
        $allowedByBuild = $image->isCurrent('build-1', DriverImagePhase::Allow);
        $image->acknowledged();
        $image->markChecksSent('check-1');
        $checkIsCurrent = $image->isCurrent('check-1', DriverImagePhase::Check);
        $image->checked();

        $this->assertSame(
            [false, false, true, DriverImageStatus::Ready, 1, [DriverImageAdmitted::class]],
            [$staleBuild, $allowedByBuild, $checkIsCurrent, $image->status, $image->attempt, $this->raised($image)],
        );
    }

    public function test_three_failed_recoveries_in_a_row_refuse_the_image_and_a_ready_one_counts_again(): void
    {
        $image = HostDriverImage::reserve($this->host, $this->recipe);

        $image->startAttempt('build-1');
        $image->interrupted('the host restarted');
        $image->startAttempt('build-2');
        $image->built(self::IMAGE);
        $image->absent();
        $afterTwo = [$image->status, $image->failures, $image->image];
        $this->readyFrom($image, 'build-3');
        $afterReady = $image->failures;

        foreach (['build-4', 'build-5', 'build-6'] as $build) {
            $image->startAttempt($build);
            $image->built(self::IMAGE);
            $image->absent();
        }

        $this->assertSame(
            [[DriverImageStatus::Pending, 2, null], 0, DriverImageStatus::Refused, DriverImageRefused::class],
            [$afterTwo, $afterReady, $image->status, $this->raised($image)[1]],
        );
        $this->assertStringContainsString('recovery failed 3 times in a row', (string) $image->refusal);
    }

    public function test_a_start_waits_once(): void
    {
        [, $opened] = $this->openRuntime();
        $start = $this->journal->startOfSession($opened->sessionId);
        $image = HostDriverImage::reserve($this->host, $this->recipe);

        HostDriverImageWait::for($image, $start);

        $this->assertSame(1, HostDriverImageWait::query()->of($image)->count());
        $this->expectException(UniqueConstraintViolationException::class);

        HostDriverImageWait::for($image, $start);
    }

    private function readyFrom(HostDriverImage $image, string $build): void
    {
        $image->startAttempt($build);
        $image->built(self::IMAGE);
        $image->orderedIn("allow-of-{$build}");
        $image->acknowledged();
        $image->markChecksSent("check-of-{$build}");
        $image->checked();
    }

    /**
     * @return list<class-string>
     */
    private function raised(HostDriverImage $image): array
    {
        return array_map(fn (object $event) => $event::class, $image->takeRaisedEvents());
    }
}
