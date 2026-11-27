<?php

declare(strict_types=1);

namespace Tests\Machinery\Agents;

use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Exceptions\DriverImageMismatch;
use App\Exceptions\DriverImageUnfrozen;
use App\Models\Agents\AgentSession;
use App\Models\Projects\DriverImageRecipeRecord;
use App\Models\Projects\Host;
use App\Models\Projects\HostDriverImage;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A session freezes the driver image it first ran and the recipe it was built from, once: it keeps that recipe's
 * version after the deploy moves the pin, keeps the recipe from being pruned while it lives, and refuses a rebuilt
 * image of another digest; a session that froze none runs the driver's current pin.
 */
#[TestsMachinery(AgentSession::class)]
final class FrozenDriverImageTest extends TestCase
{
    use OpensLedgerRuntimes;
    use RefreshHookDatabase;

    private const string IMAGE = 'sha256:5555555555555555555555555555555555555555555555555555555555555555';

    public function test_a_session_runs_the_version_it_froze_after_the_pin_moved(): void
    {
        [$host, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        $profile = $this->journal->driverProfile(DefaultDrivers::CLAUDE_CODE);
        $beforeFreeze = $session->pinnedBuildOf($profile);
        [$image, $recipe] = $this->readyImageOn($host->hostId, '2.1.200');

        $session->freezeDriverImage($image, $recipe);

        $this->journal->assertResult(
            [$profile->build(), '2.1.200', self::IMAGE, true, [$recipe->id]],
            [
                $beforeFreeze,
                $session->refresh()->pinnedBuildOf($profile),
                $session->driverImage(),
                $recipe->isDemanded(),
                array_column(DriverImageRecipeRecord::findFrozenOn($host->hostId), 'id'),
            ],
        );
    }

    public function test_a_rebuilt_image_of_another_digest_never_replaces_the_frozen_one(): void
    {
        [$host, $opened] = $this->openRuntime();
        $session = AgentSession::query()->findOrFail($opened->sessionId);
        [$image, $recipe] = $this->readyImageOn($host->hostId, '2.1.200');
        $session->freezeDriverImage($image, $recipe);
        $image->image = 'sha256:'.str_repeat('6', 64);

        $this->journal->assertRefused(
            DriverImageMismatch::class,
            fn () => $session->freezeDriverImage($image, $recipe),
        );
    }

    public function test_a_session_that_froze_no_image_has_none_to_run(): void
    {
        [, $opened] = $this->openRuntime();

        $this->journal->assertRefused(
            DriverImageUnfrozen::class,
            fn () => AgentSession::query()->findOrFail($opened->sessionId)->driverImage(),
        );
    }

    /**
     * @return array{HostDriverImage, DriverImageRecipeRecord}
     */
    private function readyImageOn(string $hostId, string $version): array
    {
        $files = ['Dockerfile' => 'FROM x'];
        $recipe = DriverImageRecipeRecord::keep(DriverImageRecipe::of('d', $files, 'base@sha256:a', $version));
        $image = HostDriverImage::reserve(Host::query()->findOrFail($hostId), $recipe);
        $image->startAttempt('build-1');
        $image->built(self::IMAGE);

        return [$image, $recipe];
    }
}
