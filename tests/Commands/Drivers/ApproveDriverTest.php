<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\ApproveDriver\ApproveDriverCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\ArrangementType;
use App\Support\ActorIdentity;
use App\Support\DefaultDrivers;
use App\Support\DriverCatalogue;
use App\Support\HostDescriptorEnrollment;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\HostDescriptor;
use App\Values\OwnerAuthority;
use App\Values\ProviderKey;
use Domain\Chat\ChatDomain;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A host enrolls a third-party driver only once its build is approved, and only the approved build.
 */
#[TestsCommand(ApproveDriverCommand::class)]
final class ApproveDriverTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_host_enrolls_a_third_party_driver_only_once_approved_and_only_an_approved_build(): void
    {
        $this->registryWithAcme();
        $enrollment = $this->app->make(HostDescriptorEnrollment::class);
        $reasonFor = fn (string $build): string|null => $enrollment->enroll([$this->descriptor($build)])[0]->unavailableReason;

        $this->assertSame(HostDescriptorEnrollment::REGISTRATION_UNAPPROVED, $reasonFor('1.0.0'));

        $this->app->make(CurrentActorSetter::class)->set(ActorIdentity::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ApproveDriverCommand(DriverKey::from('acme/reader'), ['1.0.0']));

        $this->assertSame([null, HostDescriptorEnrollment::BUILD_UNAPPROVED], [$reasonFor('1.0.0'), $reasonFor('2.0.0')]);
    }

    private function registryWithAcme(): DriverCatalogue
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $registry);
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily('acme', 'Acme', ProviderKey::from('acme'), 'acme', $claude->isolatesHooksPerSession, []),
        );
        $registry->register($this->acme('acme/reader', DriverType::Headless));

        return $registry;
    }

    private function acme(string $key, DriverType $mode): DriverRegistration
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();

        return new DriverRegistration(
            DriverKey::from($key),
            'acme',
            $mode,
            $mode === DriverType::Headless ? 'Acme reader' : 'Acme reader terminal',
            [],
            $headless->hookProtocol,
            $headless->accountProtocol,
            $headless->skillProtocol,
            AcmeReaderCapabilities::class,
            [],
        );
    }

    private function descriptor(string $build): HostDescriptor
    {
        $registry = $this->app->make(DriverCatalogueContract::class);

        return new HostDescriptor(
            DriverKey::from('acme/reader'),
            $build,
            ArrangementType::Local,
            ExecutionModeType::ProtectedHost,
        );
    }
}
