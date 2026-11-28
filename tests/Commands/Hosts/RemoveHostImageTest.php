<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\RemoveHostImage\RemoveHostImageCommand;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host is ordered to remove an image from its Docker daemon, by the image's reference.
 */
#[TestsCommand(RemoveHostImageCommand::class)]
final class RemoveHostImageTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_to_remove_the_image(): void
    {
        $image = 'sha256:'.str_repeat('c', 64);
        $this->journal->enrollContainedHost('Box', [base_path()]);

        $this->journal->asSystem(new RemoveHostImageCommand($this->journal->hostCalled('Box')->hostId, $image));
        $removal = array_slice($this->journal->hostInstructionsOn('Box'), -1)[0];

        $this->journal->assertResult(
            [HostInstructionType::RemoveImage, ['image' => $image]],
            [$removal->type, $this->journal->payloadOf($removal)],
        );
    }
}
