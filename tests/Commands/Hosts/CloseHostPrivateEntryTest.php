<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\CloseHostPrivateEntry\CloseHostPrivateEntryCommand;
use App\Enums\Hosts\HostOrderType;
use App\Values\HostOrderSource;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Closing a private entry orders the host to end the shield it put up; the order carries nothing.
 */
#[TestsCommand(CloseHostPrivateEntryCommand::class)]
final class CloseHostPrivateEntryTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_close_order_goes_to_the_processs_host_with_no_payload(): void
    {
        $this->journal->enrollHost('Mac', [base_path()])->openHostProcess('Mac', 'claude');
        $process = $this->journal->hostProcessCalled('claude');

        $this->journal->asSystem(new CloseHostPrivateEntryCommand($process->id, HostOrderSource::fromJournal()));

        $order = $this->journal->hostOrdersOf('claude')[1];
        $this->journal->assertResult(
            [HostOrderType::ClosePrivate, $process->host_id, []],
            [$order->type, $order->host_id, $this->journal->payloadOf($order)],
        );
    }
}
