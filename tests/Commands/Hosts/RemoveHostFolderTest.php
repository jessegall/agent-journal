<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Commands\Hosts\RemoveHostFolder\RemoveHostFolderCommand;
use App\Enums\Hosts\HostOrderType;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The host is ordered to remove an account folder once for each operation: the same operation asked again finds the
 * order already made.
 */
#[TestsCommand(RemoveHostFolderCommand::class)]
final class RemoveHostFolderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_host_is_ordered_once_for_the_operation(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $first = $this->journal->asSystem(new RemoveHostFolderCommand($hostId, 'a7', 'operation-1'));
        $again = $this->journal->asSystem(new RemoveHostFolderCommand($hostId, 'a7', 'operation-1'));
        $other = $this->journal->asSystem(new RemoveHostFolderCommand($hostId, 'a7', 'operation-2'));

        $order = $this->journal->hostOrdersOn('Box')[0];
        $this->journal->assertResult(
            [$first, false, HostOrderType::RemoveFolder, [
                'folder' => 'a7',
                'operation' => 'operation-1',
            ], 2],
            [
                $again,
                $first === $other,
                $order->type,
                $this->journal->payloadOf($order),
                count($this->journal->hostOrdersOn('Box')),
            ],
        );
    }
}
