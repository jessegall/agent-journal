<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\RemoveHostProcess\RemoveHostProcessCommand;
use App\Enums\Hosts\HostOrderType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host is ordered to remove the container the process ran in, by the name it gave it.
 */
#[TestsCommand(RemoveHostProcessCommand::class)]
final class RemoveHostProcessTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_to_remove_the_processs_container(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'probe');
        $processId = $this->journal->hostProcessCalled('probe')->id;

        $this->journal->asSystem(new RemoveHostProcessCommand($processId));
        $orders = $this->journal->hostOrdersOn('Mac');
        $removal = $orders[array_key_last($orders)];

        $this->journal->assertResult(
            [HostOrderType::Remove, ['container' => "journal-process-{$processId}", 'network' => '', 'session' => '']],
            [$removal->type, $this->journal->payloadOf($removal)],
        );
    }
}
