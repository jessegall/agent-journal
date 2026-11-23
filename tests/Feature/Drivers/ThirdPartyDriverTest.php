<?php

declare(strict_types=1);

namespace Tests\Feature\Drivers;

use App\Commands\ApproveDriver\ApproveDriverCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\ArrangementType;
use App\Enums\DriverCapability;
use App\Enums\DriverVariant;
use App\Enums\ExecutionModeType;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverRegisteredTwice;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\DriverRegistry;
use App\Support\HostDescriptorEnrollment;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use App\Values\HostDescriptor;
use App\Values\OwnerAuthority;
use App\Values\ProviderKey;
use Domain\Chat\Data\DriverChoiceData;
use Tests\Fixtures\Drivers\AcmeReaderCapabilities;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A package outside the journal registers its own driver family through the registry, and a host runs it only once
 * the owner approved it and one of its builds.
 */
final class ThirdPartyDriverTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_package_registers_a_one_mode_family_and_the_picker_lists_it_by_its_label(): void
    {
        $registry = $this->registryWithAcme();

        $listed = array_values(array_filter(
            DriverChoiceData::listed($registry),
            fn (DriverChoiceData $choice) => $choice->family === 'acme',
        ));

        $this->assertSame(
            [['acme/reader', 'Acme reader', DriverVariant::Headless, true]],
            array_map(fn (DriverChoiceData $choice) => [$choice->key, $choice->label, $choice->mode, $choice->isAvailable], $listed),
        );
    }

    public function test_a_second_mode_registers_beside_the_first_and_a_repeated_key_is_refused(): void
    {
        $registry = $this->registryWithAcme();

        $registry->register($this->acme('acme/reader-terminal', DriverVariant::Terminal));

        $this->assertSame(
            ['acme/reader', 'acme/reader-terminal'],
            [
                (string) $registry->keyFor('acme', DriverVariant::Headless),
                (string) $registry->keyFor('acme', DriverVariant::Terminal),
            ],
        );
        $this->expectException(DriverRegisteredTwice::class);
        $registry->register($this->acme('acme/reader', DriverVariant::Headless));
    }

    public function test_a_profile_that_needs_a_hook_the_driver_lacks_cannot_launch_it(): void
    {
        $registry = $this->registryWithAcme();

        $this->assertThrows(
            fn () => $registry->pinned('acme', DriverVariant::Headless, [DriverCapability::HookMethods]),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::HookMethods, AcmeReaderCapabilities::NO_HOOKS)->getMessage(),
        );
        $this->assertSame('acme/reader', (string) $registry->pinned('acme', DriverVariant::Headless)->registration->key);
    }

    public function test_a_host_enrolls_a_third_party_driver_only_once_approved_and_only_an_approved_build(): void
    {
        $this->registryWithAcme();
        $enrollment = $this->app->make(HostDescriptorEnrollment::class);
        $reasonFor = fn (string $build): string|null => $enrollment->enroll([$this->descriptor($build)])[0]->unavailableReason;

        $this->assertSame(HostDescriptorEnrollment::REGISTRATION_UNAPPROVED, $reasonFor('1.0.0'));

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ApproveDriverCommand(DriverKey::from('acme/reader'), ['1.0.0']));

        $this->assertSame([null, HostDescriptorEnrollment::BUILD_UNAPPROVED], [$reasonFor('1.0.0'), $reasonFor('2.0.0')]);
    }

    private function registryWithAcme(): DriverRegistry
    {
        $registry = $this->app->make(DriverCatalogue::class);
        $this->assertInstanceOf(DriverRegistry::class, $registry);
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily('acme', 'Acme', ProviderKey::from('acme'), 'acme', $claude->isolatesHooksPerSession),
        );
        $registry->register($this->acme('acme/reader', DriverVariant::Headless));

        return $registry;
    }

    private function acme(string $key, DriverVariant $mode): DriverRegistration
    {
        $registry = $this->app->make(DriverCatalogue::class);
        $headless = $registry->forKey(DriverKey::from('claude-code-headless'))->descriptor();

        return new DriverRegistration(
            DriverKey::from($key),
            'acme',
            $mode,
            $mode === DriverVariant::Headless ? 'Acme reader' : 'Acme reader terminal',
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
        $registry = $this->app->make(DriverCatalogue::class);

        return new HostDescriptor(
            DriverKey::from('acme/reader'),
            $build,
            ArrangementType::Local,
            ExecutionModeType::ProtectedHost,
        );
    }
}
