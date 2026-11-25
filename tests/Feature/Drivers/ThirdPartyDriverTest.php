<?php

declare(strict_types=1);

namespace Tests\Feature\Drivers;

use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Enums\Agents\ExecutionModeType;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverType;
use App\Enums\Projects\ArrangementType;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverRegisteredTwice;
use App\Support\DefaultDrivers;
use App\Support\DriverCatalogue;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\HostDescriptor;
use App\Values\ProviderKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Data\DriverChoiceData;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A package outside the journal registers its own driver family through the registry, and a host runs it only once
 * the owner approved it and one of its builds.
 */
final class ThirdPartyDriverTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_package_registers_a_one_mode_family_and_the_picker_lists_it_by_its_label(): void
    {
        $registry = $this->registryWithAcme();

        $listed = array_values(array_filter(
            DriverChoiceData::listed($registry),
            fn (DriverChoiceData $choice) => $choice->family === 'acme',
        ));

        $this->assertSame(
            [['acme/reader', 'Acme reader', DriverType::Headless, true]],
            array_map(fn (DriverChoiceData $choice) => [$choice->key, $choice->label, $choice->driverType, $choice->isAvailable], $listed),
        );
    }

    public function test_a_second_mode_registers_beside_the_first_and_a_repeated_key_is_refused(): void
    {
        $registry = $this->registryWithAcme();

        $registry->register($this->acme('acme/reader-terminal', DriverType::Terminal));

        $this->assertSame(
            ['acme/reader', 'acme/reader-terminal'],
            [
                (string) $registry->keyFor('acme', DriverType::Headless),
                (string) $registry->keyFor('acme', DriverType::Terminal),
            ],
        );
        $this->expectException(DriverRegisteredTwice::class);
        $registry->register($this->acme('acme/reader', DriverType::Headless));
    }

    public function test_a_profile_that_needs_a_hook_the_driver_lacks_cannot_start_it(): void
    {
        $registry = $this->registryWithAcme();

        $this->assertThrows(
            fn () => $registry->pinned('acme', DriverType::Headless, [DriverCapability::HookMethods]),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::HookMethods, AcmeReaderCapabilities::NO_HOOKS)->getMessage(),
        );
        $this->assertSame('acme/reader', (string) $registry->pinned('acme', DriverType::Headless)->registration->key);
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
