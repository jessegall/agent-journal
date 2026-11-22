<?php

declare(strict_types=1);

namespace Tests\Feature\Drivers;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Capabilities\CodexHeadlessCapabilities;
use App\Drivers\Capabilities\CodexTerminalCapabilities;
use App\Drivers\Capabilities\HeadlessCapabilities;
use App\Drivers\Contracts\Driver;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Enums\SupportState;
use App\Drivers\Exceptions\DriverCapabilityUnsupported;
use App\Drivers\Exceptions\DriverKeyInvalid;
use App\Drivers\Exceptions\DriverModeAmbiguous;
use App\Drivers\Exceptions\DriverRegisteredTwice;
use App\Drivers\Exceptions\DriverUnknown;
use App\Drivers\Support\DefaultDrivers;
use App\Drivers\Support\DriverRegistry;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\DriverKey;
use App\Drivers\Values\DriverRegistration;
use Tests\TestCase;

/**
 * Doc 103, sections 3 to 7 (task 2210): the journal holds four drivers under opaque keys, selects one only by its key,
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
        $this->assertThrows(fn () => $registry->register($this->renamed($claude, 'acme/claude')), DriverModeAmbiguous::class);
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
            fn () => $registry->pinned('codex', DriverVariant::Headless, [DriverCapability::ExactResume]),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(
                DriverCapability::ExactResume,
                CodexHeadlessCapabilities::NO_EXACT_RESUME,
            )->getMessage(),
        );
        $this->assertSame(
            'codex-headless',
            (string) $registry->pinned('codex', DriverVariant::Headless)->registration->key,
        );
        $this->assertSame(
            'claude-code-headless',
            (string) $registry->pinned('claude-code', DriverVariant::Headless, [DriverCapability::ExactResume])
                ->registration->key,
        );
    }

    public function test_the_codex_terminal_reports_itself_unavailable_with_its_reason(): void
    {
        $support = $this->registry()->forKey(DriverKey::from('codex'))->capabilities(BoundTarget::onHost('host-1'));
        $run = $support->supportOf(DriverCapability::Run);

        $this->assertSame(SupportState::TemporarilyUnavailable, $run->state);
        $this->assertSame(CodexTerminalCapabilities::NOT_PROVEN, $run->reason);
        $this->assertThrows(
            fn () => $support->assertSupports([DriverCapability::Run]),
            DriverCapabilityUnsupported::class,
            DriverCapabilityUnsupported::for(DriverCapability::Run, CodexTerminalCapabilities::NOT_PROVEN)->getMessage(),
        );
    }

    public function test_a_headless_driver_runs_but_has_no_terminal(): void
    {
        $support = $this->registry()->forKey(DriverKey::from('codex-headless'))->capabilities(BoundTarget::onHost('host-1'));

        $this->assertTrue($support->supportOf(DriverCapability::Run)->isAllowed());
        $this->assertSame(HeadlessCapabilities::NO_TERMINAL, $support->supportOf(DriverCapability::Watch)->reason);
    }

    private function registry(): DriverRegistry
    {
        $drivers = $this->app->make(DriverCatalogue::class);
        $this->assertInstanceOf(DriverRegistry::class, $drivers);

        return $drivers;
    }

    private function renamed(DriverRegistration $registration, string $key): DriverRegistration
    {
        return new DriverRegistration(
            DriverKey::from($key),
            $registration->family,
            DriverVariant::Terminal,
            $registration->label,
            $registration->protocolVersion,
            $registration->buildPins,
            $registration->hookProtocol,
            $registration->accountProtocol,
            $registration->skillProtocol,
            $registration->capabilities,
            $registration->profileRequirements,
        );
    }
}
