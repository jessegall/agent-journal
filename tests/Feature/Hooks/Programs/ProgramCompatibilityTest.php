<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\DriverEvidence;
use App\Hooks\Exceptions\DriverArrangementUnproven;
use App\Hooks\Support\DriverCompatibility;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Each adapter's pinned program is the build its account-free capture checked, every flag it relies on exists in
 * that build, and no account start passes while the real program has not shown how starts share a sign-in.
 */
final class ProgramCompatibilityTest extends TestCase
{
    private const array CAPTURES = [
        'claude-code' => 'tests/Fixtures/Accounts/Claude/capture.json',
        'codex' => 'tests/Fixtures/Accounts/Codex/capture.json',
    ];

    /**
     * @return iterable<string, array{HookDriver}>
     */
    public static function drivers(): iterable
    {
        foreach (HookDriver::cases() as $driver) {
            yield $driver->value => [$driver];
        }
    }

    #[DataProvider('drivers')]
    public function test_the_pinned_build_is_the_captured_one(HookDriver $driver): void
    {
        $capture = $this->captureOf($driver);
        $compatibility = $this->compatibilityOf($driver);

        $this->assertSame($driver, $compatibility->driver);
        $this->assertSame($capture['version'], $compatibility->version);
        $this->assertTrue($compatibility->isPinnedBinary($capture['binary_sha256']));
        $this->assertFalse($compatibility->isPinnedBinary(str_repeat('0', 64)));
    }

    public function test_every_claude_start_flag_exists_in_the_captured_build(): void
    {
        $captured = $this->captureOf(HookDriver::ClaudeCode)['flags_present'];
        $relied = $this->compatibilityOf(HookDriver::ClaudeCode)->startFlags;

        $this->assertSame([], array_values(array_diff($relied, $captured)));
    }

    public function test_codex_keeps_its_sign_in_in_the_account_file_under_one_owner(): void
    {
        $compatibility = $this->compatibilityOf(HookDriver::Codex);

        $this->assertSame(['cli_auth_credentials_store' => 'file'], $compatibility->settings);
        $this->assertSame(AuthenticationArrangement::SharedOwner, $compatibility->arrangement);
    }

    #[DataProvider('drivers')]
    public function test_an_arrangement_not_shown_on_the_real_program_refuses_the_start(HookDriver $driver): void
    {
        $compatibility = $this->compatibilityOf($driver);

        $this->assertSame(DriverEvidence::PrerequisiteMissing, $compatibility->arrangementEvidence);
        $this->expectException(DriverArrangementUnproven::class);

        $compatibility->assertStartable();
    }

    public function test_only_native_evidence_lets_a_start_through(): void
    {
        $shown = $this->withEvidence(DriverEvidence::NativeShown, 'this test');
        $shown->assertStartable();

        $this->expectException(DriverArrangementUnproven::class);

        $this->withEvidence(DriverEvidence::ContractPassed, 'this test')->assertStartable();
    }

    private function withEvidence(DriverEvidence $evidence): DriverCompatibility
    {
        return $this->compatibilityOf(HookDriver::Codex)->withEvidence($evidence, 'this test');
    }

    private function compatibilityOf(HookDriver $driver): DriverCompatibility
    {
        return DriverCompatibility::pinned($driver);
    }

    /**
     * @return array<string, mixed>
     */
    private function captureOf(HookDriver $driver): array
    {
        $text = (string) file_get_contents(base_path(self::CAPTURES[$driver->value]));

        return json_decode($text, true, flags: JSON_THROW_ON_ERROR);
    }
}
