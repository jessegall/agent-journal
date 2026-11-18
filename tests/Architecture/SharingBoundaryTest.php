<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Support\CommandRegistry;
use App\CoreApi;
use App\CoreCommands;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\DisableShareGateway;
use App\Sharing\Commands\ExpireShares;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Commands\RefreshShareScope;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\RetryShare;
use App\Sharing\Commands\RevokeShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Contracts\ProvidesShareGateways;
use App\Sharing\Contracts\ProvidesShareRecords;
use App\Sharing\Contracts\Shareable;
use App\Sharing\Contracts\ShareGateway;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Contracts\ShareRecordProvider;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareCreated;
use App\Sharing\Events\ShareExpired;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Events\ShareGatewayChanged;
use App\Sharing\Events\ShareRequested;
use App\Sharing\Events\ShareRevoked;
use App\Sharing\Events\ShareScopeChanged;
use App\Sharing\Support\ReadPermit;
use Illuminate\Contracts\Queue\ShouldQueue;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
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
    private const array ENTRY_COMMANDS = [SaveSharePreview::class, CreateShare::class, RequestShare::class, ApproveShareRequest::class, RevokeShare::class, RefreshShareScope::class, RetryShare::class, ConfigureShareGateway::class, DisableShareGateway::class];

    private const array SYSTEM_COMMANDS = [ReadShare::class, ExpireShares::class, ClaimGatewayOperation::class, RecordGatewayOutcome::class, RecordGatewayHealth::class];

    private const array SEAMS = [Shareable::class, ShareRecordProvider::class, ShareGateway::class, ProvidesShareRecords::class, ProvidesShareGateways::class, SharePolicy::class];

    private const array EVENTS = [ShareRequested::class, ShareCreated::class, ShareActivated::class, ShareFailed::class, ShareScopeChanged::class, ShareRevoked::class, ShareExpired::class, ShareGatewayChanged::class];

    public function test_no_core_sharing_file_names_a_domain_namespace(): void
    {
        $offending = [];

        foreach ($this->sharingFiles() as $file) {
            if (preg_match('/(^use\s+\\\\?Domain\\\\|[^A-Za-z]\\\\Domain\\\\)/m', (string) file_get_contents($file)) === 1) {
                $offending[] = $file;
            }
        }

        $this->assertSame([], $offending);
    }

    public function test_every_sharing_command_is_registered_through_the_bus_and_none_is_queued(): void
    {
        $registry = $this->app->make(CommandRegistry::class);
        $sharing = array_values(array_filter(CoreCommands::commands(), fn (string $command) => str_starts_with($command, 'App\\Sharing\\Commands\\')));

        $this->assertEqualsCanonicalizing([...self::ENTRY_COMMANDS, ...self::SYSTEM_COMMANDS], $sharing);

        foreach ($sharing as $command) {
            $this->assertTrue($registry->has($command), "{$command} is not registered.");
            $this->assertFalse(is_subclass_of($command, ShouldQueue::class), "{$command} is queued.");
        }
    }

    public function test_core_exports_the_sharing_seams_events_and_entry_commands_and_nothing_private(): void
    {
        $exports = CoreApi::exports();

        foreach ([...self::SEAMS, ...self::EVENTS, ...self::ENTRY_COMMANDS] as $exported) {
            $this->assertTrue($exports->has($exported), "{$exported} is not exported.");
        }

        foreach (self::EVENTS as $event) {
            $this->assertTrue($exports->hasEvent($event), "{$event} is not exported as an event.");
        }

        foreach (self::ENTRY_COMMANDS as $command) {
            $this->assertTrue($exports->hasCommand($command), "{$command} is not exported as a command.");
        }

        $private = [...self::SYSTEM_COMMANDS, ReadPermit::class, ...$this->classesIn('Models'), ...$this->classesIn('Handlers'), ...$this->classesIn('Actions')];

        foreach ($private as $class) {
            $this->assertFalse($exports->has($class), "{$class} is exported.");
        }
    }

    /**
     * @return list<string>
     */
    private function sharingFiles(): array
    {
        $files = [];
        $roots = [app_path('Sharing'), app_path('Http/Controllers/Sharing'), app_path('Http/Requests/Sharing'), app_path('Http/Data/Sharing'), app_path('Http/Middleware/Sharing')];

        foreach (array_filter($roots, is_dir(...)) as $root) {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root)) as $file) {
                if ($file instanceof SplFileInfo && $file->getExtension() === 'php') {
                    $files[] = $file->getPathname();
                }
            }
        }

        return $files;
    }

    /**
     * @return list<string>
     */
    private function classesIn(string $folder): array
    {
        return array_map(fn (string $file) => 'App\\Sharing\\'.$folder.'\\'.basename($file, '.php'), glob(app_path("Sharing/{$folder}/*.php")) ?: []);
    }
}
