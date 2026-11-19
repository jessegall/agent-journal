<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks\Programs;

use App\Hooks\Enums\AuthenticationArrangement;
use App\Hooks\Enums\ProgramEvidence;
use App\Hooks\Exceptions\ProgramArrangementUnproven;
use App\Hooks\Support\ProgramCompatibility;
use App\Programs\Enums\HookProgram;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

/**
 * Each adapter's pinned program is the build its account-free capture checked, every flag it relies on exists in
 * that build, and no account launch passes while the real program has not shown how launches share a sign-in.
 */
final class ProgramCompatibilityTest extends TestCase
{
    private const array CAPTURES = [
        'claude-code' => 'tests/Fixtures/Accounts/Claude/capture.json',
        'codex' => 'tests/Fixtures/Accounts/Codex/capture.json',
    ];

    /**
     * @return iterable<string, array{HookProgram}>
     */
    public static function programs(): iterable
    {
        foreach (HookProgram::cases() as $program) {
            yield $program->value => [$program];
        }
    }

    #[DataProvider('programs')]
    public function test_the_pinned_build_is_the_captured_one(HookProgram $program): void
    {
        $capture = $this->captureOf($program);
        $compatibility = $this->compatibilityOf($program);

        $this->assertSame($program, $compatibility->program);
        $this->assertSame($capture['version'], $compatibility->version);
        $this->assertTrue($compatibility->isPinnedBinary($capture['binary_sha256']));
        $this->assertFalse($compatibility->isPinnedBinary(str_repeat('0', 64)));
    }

    public function test_every_claude_launch_flag_exists_in_the_captured_build(): void
    {
        $captured = $this->captureOf(HookProgram::ClaudeCode)['flags_present'];
        $relied = $this->compatibilityOf(HookProgram::ClaudeCode)->launchFlags;

        $this->assertSame([], array_values(array_diff($relied, $captured)));
    }

    public function test_codex_keeps_its_sign_in_in_the_account_file_under_one_owner(): void
    {
        $compatibility = $this->compatibilityOf(HookProgram::Codex);

        $this->assertSame(['cli_auth_credentials_store' => 'file'], $compatibility->settings);
        $this->assertSame(AuthenticationArrangement::SharedOwner, $compatibility->arrangement);
    }

    #[DataProvider('programs')]
    public function test_an_arrangement_not_shown_on_the_real_program_refuses_the_launch(HookProgram $program): void
    {
        $compatibility = $this->compatibilityOf($program);

        $this->assertSame(ProgramEvidence::PrerequisiteMissing, $compatibility->arrangementEvidence);
        $this->expectException(ProgramArrangementUnproven::class);

        $compatibility->requireLaunchable();
    }

    public function test_only_native_evidence_lets_a_launch_through(): void
    {
        $shown = $this->withEvidence(ProgramEvidence::NativeShown);
        $shown->requireLaunchable();

        $this->expectException(ProgramArrangementUnproven::class);

        $this->withEvidence(ProgramEvidence::ContractPassed)->requireLaunchable();
    }

    private function withEvidence(ProgramEvidence $evidence): ProgramCompatibility
    {
        $pinned = $this->compatibilityOf(HookProgram::Codex);

        return new ProgramCompatibility(
            $pinned->program,
            $pinned->version,
            $pinned->binaryDigest,
            $pinned->launchFlags,
            $pinned->settings,
            $pinned->arrangement,
            $evidence,
            $pinned->evidenceOwner,
        );
    }

    private function compatibilityOf(HookProgram $program): ProgramCompatibility
    {
        return ProgramCompatibility::pinned($program);
    }

    /**
     * @return array<string, mixed>
     */
    private function captureOf(HookProgram $program): array
    {
        $text = (string) file_get_contents(base_path(self::CAPTURES[$program->value]));

        return json_decode($text, true, flags: JSON_THROW_ON_ERROR);
    }
}
