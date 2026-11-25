<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Sharing\Shareable;
use App\Contracts\Sharing\ShareGateway;
use App\Contracts\Sharing\ShareGatewayProvider;
use App\Contracts\Sharing\SharePolicy;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Contracts\Sharing\ShareRecordProvider;
use App\CoreCommands;
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
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\GatewayRuns;
use Domain\Sharing\Support\ShareEndings;
use Domain\Sharing\Support\ShareGrants;
use Illuminate\Contracts\Queue\ShouldQueue;
use Tests\TestCase;

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

    /**
     * The name of a sharing command: one about shares or their gateways.
     */
    private const string SHARING_COMMAND = '/Shares?|Gateway/';

    private const array MODELS = [
        Share::class,
        ShareAudit::class,
        ShareGatewayConfiguration::class,
        ShareGatewayEndpoint::class,
        ShareGatewayOperation::class,
        ShareInstallation::class,
        ShareMember::class,
        SharePreview::class,
    ];

    /**
     * The services that carry out sharing work for the handlers.
     */
    private const array SHARE_WORK = [
        GatewayRuns::class,
        ShareEndings::class,
        ShareGrants::class,
    ];

    private const array SEAMS = [
        Shareable::class,
        ShareRecordProvider::class,
        ShareGateway::class,
        ShareRecordContributor::class,
        ShareGatewayProvider::class,
        SharePolicy::class,
    ];

    /**
     * The sharing facts a domain hears; the others stay Core's own until a domain needs one.
     */
    private const array EVENTS = [
        ShareActivated::class,
    ];

    public function test_every_sharing_command_is_registered_through_the_bus_and_none_is_queued(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $sharing = array_values(
            array_filter(
                CoreCommands::commands(),
                fn (string $command) => preg_match(self::SHARING_COMMAND, class_basename($command)) === 1,
            ),
        );

        $this->assertEqualsCanonicalizing([...self::ENTRY_COMMANDS, ...self::SYSTEM_COMMANDS], $sharing);

        foreach ($sharing as $command) {
            $this->assertTrue($registry->has($command), $command);
            $this->assertFalse(Reflector::of($command)->implements(ShouldQueue::class), $command);
        }
    }
}
