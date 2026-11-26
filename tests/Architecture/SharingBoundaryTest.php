<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Sharing\Commands\CreateShare\CreateShareCommand;
use App\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use App\Sharing\Commands\ExpireShares\ExpireSharesCommand;
use App\Sharing\Commands\PruneShareAudit\PruneShareAuditCommand;
use App\Sharing\Commands\ReadShare\ReadShareCommand;
use App\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Sharing\Commands\RequestShare\RequestShareCommand;
use App\Sharing\Commands\RetryShare\RetryShareCommand;
use App\Sharing\Commands\RevokeShare\RevokeShareCommand;
use App\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Support\CommandRegistry;
use App\Support\Reflector;
use Illuminate\Contracts\Queue\ShouldQueue;

/**
 * Core sharing keeps its boundary: every sharing command is registered through the bus grammar and none is queued, and
 * Core exports exactly the sharing seams, events and entry commands while its models, handlers, services, read permit
 * and System runtime commands stay private.
 */
final class SharingBoundaryTest extends TestCase
{
    /**
     * The commands an owner or agent calls; every other sharing command is the System's own.
     */
    private const array ENTRY_COMMANDS = [
        SaveSharePreviewCommand::class,
        CreateShareCommand::class,
        RequestShareCommand::class,
        ApproveShareRequestCommand::class,
        RevokeShareCommand::class,
        RefreshShareScopeCommand::class,
        RetryShareCommand::class,
        ConfigureShareGatewayCommand::class,
        DisableShareGatewayCommand::class,
    ];

    private const array SYSTEM_COMMANDS = [
        ReadShareCommand::class,
        ExpireSharesCommand::class,
        ClaimGatewayOperationCommand::class,
        RecordGatewayOutcomeCommand::class,
        RecordGatewayHealthCommand::class,
        ReopenSharedGatewaysCommand::class,
        PruneShareAuditCommand::class,
    ];

    public function test_every_sharing_command_is_registered_through_the_bus_and_none_is_queued(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $sharing = array_values(
            array_filter(
                array_keys($registry->handlerMap()),
                fn (string $command) => str_starts_with($command, 'App\\Sharing\\'),
            ),
        );

        $this->assertEqualsCanonicalizing([...self::ENTRY_COMMANDS, ...self::SYSTEM_COMMANDS], $sharing);

        foreach ($sharing as $command) {
            $this->assertTrue($registry->has($command), $command);
            $this->assertFalse(Reflector::of($command)->implements(ShouldQueue::class), $command);
        }
    }
}
