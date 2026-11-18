<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\CapabilityMatrixInvalid;
use App\Agents\Readers\RecordedHostCapabilities;
use App\Agents\Support\HostCapabilityQuery;
use App\Hooks\Enums\HookProgram;
use Tests\TestCase;

/**
 * The host capabilities answer from the checked-in matrix: every pinned client has an explicit status with its
 * evidence for both execution modes, and nothing unproven may launch.
 */
final class HostCapabilitiesTest extends TestCase
{
    private string $matrixPath = '';

    public function test_every_client_has_an_explicit_status_with_evidence_in_both_execution_modes(): void
    {
        $capabilities = $this->app->make(HostCapabilities::class);

        foreach (HookProgram::cases() as $program) {
            foreach (ExecutionModeType::cases() as $mode) {
                $capability = $capabilities->capability(new HostCapabilityQuery($program, AccountModeType::Subscription, $mode));

                $this->assertNotSame('No evidence is recorded for this combination.', $capability->reason, "{$program->value} in {$mode->value} has no row.");
                $this->assertFileExists(base_path(strtok($capability->evidence, '#')));
            }
        }
    }

    public function test_no_client_is_recorded_as_supported_in_a_container_without_native_evidence(): void
    {
        $capabilities = $this->app->make(HostCapabilities::class);

        $this->assertSame(CapabilityStatusType::Unverified, $capabilities->capability(new HostCapabilityQuery(HookProgram::ClaudeCode, AccountModeType::Subscription, ExecutionModeType::RequiredContainer))->status);
        $this->assertSame(CapabilityStatusType::Unsupported, $capabilities->capability(new HostCapabilityQuery(HookProgram::Codex, AccountModeType::Subscription, ExecutionModeType::RequiredContainer))->status);
    }

    public function test_a_launch_of_an_unproven_combination_is_refused_as_account_container_unsupported(): void
    {
        $capability = $this->app->make(HostCapabilities::class)->capability(new HostCapabilityQuery(HookProgram::Codex, AccountModeType::Subscription, ExecutionModeType::RequiredContainer));

        try {
            $capability->requireSupported();
            $this->fail('An unproven combination was admitted.');
        } catch (AccountContainerUnsupported $refusal) {
            $this->assertSame(LaunchRefusalType::AccountContainerUnsupported, $refusal->reason());
            $this->assertStringStartsWith('The journal cannot launch codex with a subscription account in required_container mode: ', $refusal->getMessage());
            $this->assertStringEndsWith('Nothing was launched.', $refusal->getMessage());
        }
    }

    public function test_a_supported_row_admits_and_a_missing_row_is_unverified(): void
    {
        $capabilities = new RecordedHostCapabilities($this->matrix([['program' => 'codex', 'account_mode' => 'subscription', 'execution_mode' => 'protected_host', 'status' => 'supported', 'evidence' => 'docs/x.md', 'reason' => 'Proven.']]));

        $capabilities->capability(new HostCapabilityQuery(HookProgram::Codex, AccountModeType::Subscription, ExecutionModeType::ProtectedHost))->requireSupported();
        $this->assertSame(CapabilityStatusType::Unverified, $capabilities->capability(new HostCapabilityQuery(HookProgram::ClaudeCode, AccountModeType::Subscription, ExecutionModeType::ProtectedHost))->status);
    }

    public function test_a_row_with_an_unknown_status_is_refused_by_name(): void
    {
        $capabilities = new RecordedHostCapabilities($this->matrix([['program' => 'codex', 'account_mode' => 'subscription', 'execution_mode' => 'protected_host', 'status' => 'maybe', 'evidence' => 'docs/x.md', 'reason' => 'Unsure.']]));

        $this->expectExceptionObject(CapabilityMatrixInvalid::row($this->matrixPath, 0, 'status'));

        $capabilities->capability(new HostCapabilityQuery(HookProgram::Codex, AccountModeType::Subscription, ExecutionModeType::ProtectedHost));
    }

    /**
     * @param  list<array<string, string>>  $rows
     */
    private function matrix(array $rows): string
    {
        $this->matrixPath = tempnam(sys_get_temp_dir(), 'matrix');
        file_put_contents($this->matrixPath, json_encode(['rows' => $rows], JSON_THROW_ON_ERROR));

        return $this->matrixPath;
    }
}
