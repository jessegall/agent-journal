<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\OpenHostPrivateEntry\OpenHostPrivateEntryCommand;
use App\Hosts\Enums\HostOrderType;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Opening a private entry orders the host to shield the process's screen and input until it closes; the order carries nothing.
 */
#[TestsCommand(OpenHostPrivateEntryCommand::class)]
final class OpenHostPrivateEntryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_open_order_goes_to_the_processs_host_with_no_payload(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'claude');
        $process = $this->journal->hostProcessCalled('claude');

        $this->journal->asSystem(new OpenHostPrivateEntryCommand($process->id, HostOrderSource::fromJournal()));

        $order = $this->journal->hostOrdersOf('claude')[1];
        $this->journal->assertResult(
            [HostOrderType::OpenPrivate, $process->host_id, []],
            [$order->type, $order->host_id, $this->journal->payloadOf($order)],
        );
    }
}
