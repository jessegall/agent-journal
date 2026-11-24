<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Commands\CreateShare\CreateShareCommand;
use App\Commands\DisableShareGateway\DisableShareGatewayCommand;
use App\Commands\ExpireShares\ExpireSharesCommand;
use App\Commands\PruneShareAudit\PruneShareAuditCommand;
use App\Commands\ReadShare\ReadShareCommand;
use App\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Commands\RefreshShareScope\RefreshShareScopeCommand;
use App\Commands\ReopenSharedGateways\ReopenSharedGatewaysCommand;
use App\Commands\RequestShare\RequestShareCommand;
use App\Commands\RetryShare\RetryShareCommand;
use App\Commands\RevokeShare\RevokeShareCommand;
use App\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Contracts\Sharing\Shareable;
use App\Contracts\Sharing\ShareGateway;
use App\Contracts\Sharing\ShareGatewayProvider;
use App\Contracts\Sharing\SharePolicy;
use App\Contracts\Sharing\ShareRecordContributor;
use App\Contracts\Sharing\ShareRecordProvider;
use App\CoreApi;
use App\CoreCommands;
use App\Events\ShareActivated;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Models\Sharing\ShareInstallation;
use App\Models\Sharing\ShareMember;
use App\Models\Sharing\SharePreview;
use App\Support\CommandRegistry;
use App\Support\GatewayRuns;
use App\Support\ReadPermit;
use App\Support\Reflector;
use App\Support\ShareEndings;
use App\Support\ShareGrants;
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

    public function test_core_exports_the_sharing_seams_events_and_entry_commands_and_nothing_private(): void
    {
        $exports = CoreApi::exports();

        foreach ([...self::SEAMS, ...self::EVENTS, ...self::ENTRY_COMMANDS] as $exported) {
            $this->assertTrue($exports->has($exported), $exported);
        }

        foreach (self::EVENTS as $event) {
            $this->assertTrue($exports->hasEvent($event), $event);
        }

        foreach (self::ENTRY_COMMANDS as $command) {
            $this->assertTrue($exports->hasCommand($command), $command);
        }

        $private = [
            ...self::SYSTEM_COMMANDS,
            ReadPermit::class,
            ...self::MODELS,
            ...self::SHARE_WORK,
            ...array_map(
                fn (string $command) => substr($command, 0, -strlen('Command')).'Handler',
                [...self::ENTRY_COMMANDS, ...self::SYSTEM_COMMANDS],
            ),
        ];

        foreach ($private as $class) {
            $this->assertFalse($exports->has($class), $class);
        }
    }
}
