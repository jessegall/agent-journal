<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Contracts\Drivers\Driver;
use App\Contracts\Drivers\DriverCatalogue as DriverCatalogueContract;
use App\Enums\Drivers\DriverCapability;
use App\Enums\Drivers\DriverType;
use App\Exceptions\DriverCapabilityUnsupported;
use App\Exceptions\DriverKeyInvalid;
use App\Exceptions\DriverRegisteredTwice;
use App\Exceptions\DriverTypeAmbiguous;
use App\Exceptions\DriverUnknown;
use App\Support\Capabilities\CodexHeadlessCapabilities;
use App\Support\Capabilities\CodexTerminalCapabilities;
use App\Support\Capabilities\HeadlessCapabilities;
use App\Support\DefaultDrivers;
use App\Support\DriverCatalogue;
use App\Values\BoundTarget;
use App\Values\DriverKey;
use App\Values\DriverRegistration;
use Tests\TestCase;

/**
 * The journal holds four drivers under opaque keys, selects one only by its key,
 * refuses a repeated key or a second driver for one family and mode, and Codex's terminal says why it waits.
 */
final class DriverRegistryTest extends TestCase
{
    private const array LABELS = ['Claude Code', 'Claude Code headless', 'Codex', 'Codex headless'];

    public function test_the_registry_lists_the_four_default_labels(): void
    {
        $this->assertSame(
            self::LABELS,
            array_map(fn (DriverRegistration $registration) => $registration->label, $this->registry()->catalogue()),
        );
        $this->assertSame(4, $this->registry()->revision());
    }

    public function test_each_key_gives_its_own_driver(): void
    {
        foreach (DefaultDrivers::registrations() as $registration) {
            $driver = $this->registry()->forKey($registration->key);

            $this->assertInstanceOf(Driver::class, $driver);
            $this->assertTrue($driver->descriptor()->key->isSameAs($registration->key));
        }
    }

    public function test_an_unknown_key_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->registry()->forKey(DriverKey::from('acme/reader')),
            DriverUnknown::class,
            DriverUnknown::for('acme/reader')->getMessage(),
        );
    }

    public function test_a_repeated_key_and_a_second_driver_for_one_mode_are_refused(): void
    {
        $registry = $this->registry();
        $claude = DefaultDrivers::registrations()[0];

        $this->assertThrows(fn () => $registry->register($claude), DriverRegisteredTwice::class);
        $this->assertThrows(fn () => $registry->register($this->renamed($claude, 'acme/claude')), DriverTypeAmbiguous::class);
        $this->assertSame(4, $registry->revision());
    }

    public function test_a_namespaced_key_of_up_to_its_limit_is_a_key_and_anything_else_is_not(): void
    {
        $this->assertSame('acme/reader', (string) DriverKey::from('acme/reader'));
        $this->assertSame(DriverKey::CHARACTER_LIMIT, strlen((string) DriverKey::from(str_repeat('a', DriverKey::CHARACTER_LIMIT))));

        foreach ([str_repeat('a', DriverKey::CHARACTER_LIMIT + 1), 'Acme/Reader', 'a//b', 'a/b/c', '-a'] as $text) {
            $this->assertThrows(fn () => DriverKey::from($text), DriverKeyInvalid::class);
        }
    }

    public function test_a_codex_headless_resume_is_refused_with_its_reason_and_a_claude_headless_one_is_pinned(): void
    {
        $registry = $this->registry();

        $this->assertThrows(
            fn () => $registry->pinned('codex', DriverType::Headless, [DriverCapability::ExactResume]),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(
                DriverCapability::ExactResume,
                CodexHeadlessCapabilities::NO_EXACT_RESUME,
            )->getMessage(),
        );
        $this->assertSame(
            'codex-headless',
            (string) $registry->pinned('codex', DriverType::Headless)->registration->key,
        );
        $this->assertSame(
            'claude-code-headless',
            (string) $registry->pinned('claude-code', DriverType::Headless, [DriverCapability::ExactResume])
                ->registration->key,
        );
    }

    public function test_both_drivers_of_a_family_read_one_skill_protocol_and_the_families_differ(): void
    {
        $protocols = [];

        foreach ($this->registry()->catalogue() as $registration) {
            $protocols[$registration->family][] = $registration->skillProtocol;
        }

        foreach ($protocols as $family => $familyProtocols) {
            $this->assertSame([$family, $family], $familyProtocols, $family);
        }
    }

    public function test_the_codex_terminal_runs_but_shares_no_account_with_its_reason(): void
    {
        $support = $this->registry()->forKey(DriverKey::from('codex'))->capabilities(BoundTarget::onHost('host-1'));
        $shared = $support->supportOf(DriverCapability::SharedAccount);

        $support->assertSupports([DriverCapability::Run]);
        $this->assertSame(CodexTerminalCapabilities::RUNS_ALONE, $shared->reason);
    }

    public function test_a_headless_driver_runs_but_has_no_terminal(): void
    {
        $support = $this->registry()->forKey(DriverKey::from('codex-headless'))->capabilities(BoundTarget::onHost('host-1'));

        $this->assertTrue($support->supportOf(DriverCapability::Run)->isAllowed());
        $this->assertSame(HeadlessCapabilities::NO_TERMINAL, $support->supportOf(DriverCapability::Watch)->reason);
    }

    public function test_every_driver_takes_attachments_as_references_and_none_takes_native_binary_input(): void
    {
        $answers = array_map(
            function (string $key): array {
                $support = $this->registry()->forKey(DriverKey::from($key))->capabilities(BoundTarget::onHost('host-1'));

                return [
                    $key,
                    $support->supportOf(DriverCapability::Attachments)->isAllowed(),
                    $support->supportOf(DriverCapability::NativeBinaryInput)->reason,
                ];
            },
            ['claude-code-headless', 'claude-code', 'codex-headless'],
        );

        $this->assertSame(
            [
                ['claude-code-headless', true, DriverCapability::NO_NATIVE_BINARY],
                ['claude-code', true, DriverCapability::NO_NATIVE_BINARY],
                ['codex-headless', true, DriverCapability::NO_NATIVE_BINARY],
            ],
            $answers,
        );
    }

    private function registry(): DriverCatalogue
    {
        $drivers = $this->app->make(DriverCatalogueContract::class);
        $this->assertInstanceOf(DriverCatalogue::class, $drivers);

        return $drivers;
    }

    private function renamed(DriverRegistration $registration, string $key): DriverRegistration
    {
        return new DriverRegistration(
            DriverKey::from($key),
            $registration->family,
            DriverType::Terminal,
            $registration->label,
            $registration->buildPins,
            $registration->hookProtocol,
            $registration->accountProtocol,
            $registration->skillProtocol,
            $registration->capabilities,
            $registration->profileRequirements,
        );
    }
}
