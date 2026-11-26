<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Hosts\Commands\AllowHostImages\AllowHostImagesCommand;
use App\Hosts\Enums\HostOrderType;
use App\Models\Projects\Host;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A contained host is ordered to run only the images named, and the journal keeps what it ordered.
 */
#[TestsCommand(AllowHostImagesCommand::class)]
final class AllowHostImagesTest extends TestCase
{
    use RefreshHookDatabase;

    private const string IMAGE = 'registry.example/agent@sha256:aaaa';

    public function test_it_orders_the_host_to_run_only_these_images_and_keeps_them(): void
    {
        $this->journal->enrollContainedHost('Box', [base_path()]);
        $hostId = $this->journal->hostCalled('Box')->hostId;

        $orderId = $this->journal->asSystem(new AllowHostImagesCommand($hostId, [self::IMAGE]));

        $order = $this->journal->hostOrdersOn('Box')[0];
        $this->journal->assertResult(
            [$orderId, HostOrderType::AllowImages, ['images' => [self::IMAGE]], [self::IMAGE]],
            [
                $order->id,
                $order->type,
                $this->journal->payloadOf($order),
                Host::query()->whereKey($hostId)->sole()->allowed_images,
            ],
        );
    }
}
