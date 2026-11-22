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
use App\Contracts\Shareable;
use App\Contracts\ShareGateway;
use App\Contracts\ShareGatewayProvider;
use App\Contracts\SharePolicy;
use App\Contracts\ShareRecordContributor;
use App\Contracts\ShareRecordProvider;
use App\CoreApi;
use App\CoreCommands;
use App\Events\ShareActivated;
use App\Events\ShareCreated;
use App\Events\ShareExpired;
use App\Events\ShareFailed;
use App\Events\ShareGatewayChanged;
use App\Events\ShareRequested;
use App\Events\ShareRevoked;
use App\Events\ShareScopeChanged;
use App\Support\CommandRegistry;
use App\Support\ReadPermit;
use App\Support\Reflector;
use Illuminate\Contracts\Queue\ShouldQueue;
use Tests\Architecture\Support\FormerPaths;
use Tests\TestCase;

/**
 * Core sharing keeps its boundary (doc 29, sections 7 and 10): no Core sharing file names a domain, every sharing
 * command is registered through the bus grammar and none is queued, and Core exports exactly the sharing seams,
 * events and entry commands while its models, handlers, read permit and System runtime commands stay private.
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

    private const array SEAMS = [
        Shareable::class,
        ShareRecordProvider::class,
        ShareGateway::class,
        ShareRecordContributor::class,
        ShareGatewayProvider::class,
        SharePolicy::class,
    ];

    private const array EVENTS = [
        ShareRequested::class,
        ShareCreated::class,
        ShareActivated::class,
        ShareFailed::class,
        ShareScopeChanged::class,
        ShareRevoked::class,
        ShareExpired::class,
        ShareGatewayChanged::class,
    ];

    public function test_no_core_sharing_file_names_a_domain_namespace(): void
    {
        $offending = [];

        foreach ($this->sharingFiles() as $file) {
            if (preg_match(
                '/(^use\s+\\\\?Domain\\\\|[^A-Za-z]\\\\Domain\\\\)/m',
                (string) file_get_contents($file),
            ) === 1) {
                $offending[] = $file;
            }
        }

        $this->assertSame([], $offending);
    }

    public function test_every_sharing_command_is_registered_through_the_bus_and_none_is_queued(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $sharing = array_values(
            array_filter(
                CoreCommands::commands(),
                fn (string $command) => FormerPaths::classWasIn($command, ['app/Sharing/Commands/']),
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
            ...$this->classesIn('Models'),
            ...$this->handlers(),
            ...$this->classesIn('Actions'),
        ];

        foreach ($private as $class) {
            $this->assertFalse($exports->has($class), $class);
        }
    }

    /**
     * The sharing files by the folders they had before plan 62 moved them to their roles.
     *
     * @return list<string>
     */
    private function sharingFiles(): array
    {
        return array_map(
            base_path(...),
            FormerPaths::filesFrom([
                'app/Sharing/',
                'app/Http/Controllers/Sharing/',
                'app/Http/Requests/Sharing/',
                'app/Http/Data/Sharing/',
                'app/Http/Middleware/Sharing/',
            ]),
        );
    }

    /**
     * @return list<string>
     */
    private function handlers(): array
    {
        return array_values(array_filter(
            $this->classesFrom('app/Sharing/Commands/'),
            fn (string $class) => str_ends_with($class, 'Handler'),
        ));
    }

    /**
     * @return list<string>
     */
    private function classesIn(string $folder): array
    {
        return array_values(array_filter(
            $this->classesFrom("app/Sharing/{$folder}/"),
            fn (string $class) => ! str_contains(substr(FormerPaths::of(self::pathOf($class)), strlen("app/Sharing/{$folder}/")), '/'),
        ));
    }

    /**
     * The classes whose files were under the old folder.
     *
     * @return list<string>
     */
    private function classesFrom(string $prefix): array
    {
        return array_map(
            fn (string $path) => 'App\\'.str_replace('/', '\\', substr($path, 4, -4)),
            FormerPaths::filesFrom([$prefix]),
        );
    }

    private static function pathOf(string $className): string
    {
        return 'app/'.str_replace('\\', '/', substr($className, 4)).'.php';
    }
}
