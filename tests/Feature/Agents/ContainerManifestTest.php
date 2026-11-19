<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Commands\LaunchAgent;
use App\Agents\Contracts\HelperImages;
use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\LaunchOriginType;
use App\Agents\Exceptions\CapacityUnavailable;
use App\Agents\Exceptions\ContainerUnavailable;
use App\Agents\Exceptions\ManifestRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\CapacityReservation;
use App\Agents\Support\ContainerManifest;
use App\Agents\Support\ExecutionBudgets;
use App\Agents\Support\ExecutionPolicy;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Agents\Support\HostCapacity;
use App\Agents\Support\LaunchPolicy;
use App\Agents\Support\LaunchRequest;
use App\Agents\Support\ManifestMount;
use App\Agents\Support\PreparedLaunch;
use App\Bus\Contracts\CommandBus;
use App\Profiles\Values\ProfileBase;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A writing helper's container gets exactly the listed controls; anything more is refused by name, and a required
 * container launch is admitted only on a proven host, with a verified image and room left, before anything is kept.
 */
final class ContainerManifestTest extends TestCase
{
    use RefreshHookDatabase;
    use StartsAgentRequests;

    private const string IMAGE = 'registry.example/journal-helper@sha256:0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

    public function test_a_writer_launch_compiles_a_manifest_with_exactly_the_listed_controls(): void
    {
        $manifest = ContainerManifest::compile(
            $this->prepared(),
            ProfileBase::writingHelper()->defaultAccess(),
            $this->policy(),
            'journal-launch-1',
        );

        $this->assertSame(
            [
                self::IMAGE,
                '10001:10001',
                '/workspace',
                true,
                [],
                true,
                'verified-default',
                false,
                [],
                'journal-launch-1',
            ],
            [
                $manifest->image,
                $manifest->user,
                $manifest->workdir,
                $manifest->readOnlyRoot,
                $manifest->capabilities,
                $manifest->noNewPrivileges,
                $manifest->seccomp,
                $manifest->privileged,
                $manifest->publishedPorts,
                $manifest->network,
            ],
        );
        $this->assertEquals([new ManifestMount('/workspaces/helper-7', '/workspace', true)], $manifest->mounts);
        $this->assertSame(2, $manifest->budgets->cpuCores);
        $this->assertFalse(
            ContainerManifest::compile(
                $this->prepared(),
                ProfileBase::readOnlyHelper()->defaultAccess(),
                $this->policy(),
                'journal-launch-1',
            )->mounts[0]->writable,
        );
    }

    public function test_the_mount_follows_the_access_declaration_not_the_type(): void
    {
        $writerAccess = ProfileBase::writingHelper()->defaultAccess();
        $readerLaunch = $this->prepared();

        $manifest = ContainerManifest::compile($readerLaunch, $writerAccess, $this->policy(), 'journal-launch-1');

        $this->assertTrue($manifest->mounts[0]->writable);
    }

    public function test_a_parent_folder_a_credential_mount_a_mutable_tag_and_a_privileged_flag_are_refused(): void
    {
        $workspace = [new ManifestMount('/workspaces/helper-7', '/workspace', true)];

        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [new ManifestMount('/workspaces/helper-7/..', '/workspace', true)],
                [],
                ExecutionBudgets::defaults(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [new ManifestMount('/Users/me/.claude', '/workspace', true)],
                [],
                ExecutionBudgets::defaults(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'net',
                [...$workspace, new ManifestMount('/var/run/docker.sock', '/var/run/docker.sock', true)],
                [],
                ExecutionBudgets::defaults(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                'registry.example/journal-helper:latest',
                '10001:10001',
                true,
                [],
                false,
                'net',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                true,
                'net',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
            ),
        );
        $this->assertRefused(
            fn () => ContainerManifest::make(
                self::IMAGE,
                '10001:10001',
                true,
                [],
                false,
                'host',
                $workspace,
                [],
                ExecutionBudgets::defaults(),
            ),
        );
    }

    public function test_a_host_without_a_proven_container_runtime_refuses_before_reserving(): void
    {
        $this->signIn();

        $this->assertThrows(fn () => $this->launch($this->containerRequest()), ContainerUnavailable::class);

        $this->assertSame(0, CapacityReservation::query()->count());
    }

    public function test_capacity_beyond_the_host_refuses(): void
    {
        $this->signIn();
        $this->app->instance(HostCapabilities::class, new class implements HostCapabilities
        {
            public function capability(HostCapabilityQuery $query): HostCapability
            {
                return new HostCapability(
                    $query,
                    CapabilityStatusType::Supported,
                    'docs/x.md',
                    'Proven for this test.',
                );
            }
        });
        $this->app->instance(HelperImages::class, new class implements HelperImages
        {
            public function isVerified(string $imageReference): bool
            {
                return true;
            }
        });
        $this->app->instance(HostCapacity::class, new HostCapacity(3, 16 * 1024 ** 3, 50 * 1024 ** 3));

        $this->launch($this->containerRequest());

        $this->assertThrows(fn () => $this->launch($this->containerRequest()), CapacityUnavailable::class);
        $this->assertSame(1, CapacityReservation::query()->count());
    }

    private function assertRefused(\Closure $make): void
    {
        $this->assertThrows($make, ManifestRefused::class);
    }

    private function prepared(): PreparedLaunch
    {
        return new PreparedLaunch(
            'launch-1',
            TestSelections::of(),
            ExecutionModeType::RequiredContainer,
            'policy-1',
            '/workspaces/helper-7',
            'account-1',
        );
    }

    private function policy(): ExecutionPolicy
    {
        return ExecutionPolicy::make(
            ExecutionModeType::RequiredContainer,
            self::IMAGE,
            'helper-7',
            ExecutionBudgets::defaults(),
            [],
        );
    }

    private function signIn(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    private function containerRequest(): LaunchRequest
    {
        $agent = Agent::named('Builder', 'writing-helper');

        return new LaunchRequest(
            TestSelections::requestId(),
            $agent->id,
            TestSelections::of(),
            LaunchOriginType::OwnerRequest,
            'helpers.job 1',
            null,
            ConversationModeType::New,
            null,
            LaunchPolicy::withoutProfile($this->policy()),
        );
    }

    private function launch(LaunchRequest $request): mixed
    {
        return $this->app->make(CommandBus::class)->run(new LaunchAgent($request));
    }
}
