<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\CommandRegistry;
use App\Support\Reflector;
use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use Domain\Sharing\Commands\ExpireShares\ExpireSharesCommand;
use Domain\Sharing\Commands\PruneShareAudit\PruneShareAuditCommand;
use Domain\Sharing\Commands\ReadShare\ReadShareCommand;
use Domain\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use Domain\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use Domain\Sharing\Commands\RefreshShareScope\RefreshShareScopeCommand;
use Domain\Sharing\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Commands\RetryShare\RetryShareCommand;
use Domain\Sharing\Commands\RevokeShare\RevokeShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
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
                fn (string $command) => str_starts_with($command, 'Domain\\Sharing\\'),
            ),
        );

        $this->assertEqualsCanonicalizing([...self::ENTRY_COMMANDS, ...self::SYSTEM_COMMANDS], $sharing);

        foreach ($sharing as $command) {
            $this->assertTrue($registry->has($command), $command);
            $this->assertFalse(Reflector::of($command)->implements(ShouldQueue::class), $command);
        }
    }
}
