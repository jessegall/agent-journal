<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\RemoveHostContainer\RemoveHostContainerCommand;
use App\Hosts\Protocol\HostInstructionType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host is ordered to remove the container of that name, stopping it first.
 */
#[TestsCommand(RemoveHostContainerCommand::class)]
final class RemoveHostContainerTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_to_remove_the_named_container(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);

        $this->journal->asSystem(new RemoveHostContainerCommand(
            $this->journal->hostCalled('Box')->hostId,
            'journal-process-left',
        ));
        $instructions = $this->journal->hostInstructionsOn('Box');
        $removal = $instructions[array_key_last($instructions)];

        $this->journal->assertResult(
            [HostInstructionType::Remove, ['container' => 'journal-process-left', 'stop_seconds' => 10]],
            [$removal->type, $this->journal->payloadOf($removal)],
        );
    }
}
