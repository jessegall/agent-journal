<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Agents\Drivers\DefaultDrivers;
use App\Commands\Drivers\ApproveDriver\ApproveDriverCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\MarkTone;
use App\Enums\Drivers\SignInCodeDirection;
use App\Models\Drivers\DriverApproval;
use App\Support\ActorReference;
use App\Support\DriverCatalogue;
use App\Values\DriverFamily;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
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

    public function test_a_third_party_driver_is_approved_with_only_the_builds_named(): void
    {
        $this->registryWithAcme();
        $this->assertSame([], DriverApproval::resolveBuildsByKey(['acme/reader']));

        $this->app->make(CurrentActorSetter::class)->set(ActorReference::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new ApproveDriverCommand(DriverKey::from('acme/reader'), ['1.0.0']));

        $this->assertSame(['acme/reader' => ['1.0.0']], DriverApproval::resolveBuildsByKey(['acme/reader']));
    }

    private function registryWithAcme(): DriverCatalogue
    {
        $registry = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $registry);
        $claude = $registry->family(DefaultDrivers::CLAUDE_CODE);
        $registry->registerFamily(
            new DriverFamily(
                'acme',
                'Acme',
                ProviderKey::from('acme'),
                'acme',
                $claude->isolatesHooksPerSession,
                [],
                [],
                'images/drivers/acme.svg',
                MarkTone::CurrentColor,
                SignInCodeDirection::Outgoing,
            ),
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
}
