<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Enums\LaunchRefusalType;
use App\Agents\Exceptions\AccountContainerUnsupported;
use App\Agents\Exceptions\CapabilityMatrixInvalid;
use App\Agents\Exceptions\HostCapabilityUnsupported;
use App\Agents\Resolvers\RecordedHostCapabilities;
use App\Agents\Support\HostCapabilityQuery;
use App\Programs\Enums\HookProgram;
use Tests\TestCase;

/**
 * The host capabilities answer from the checked-in matrix: every pinned client has an explicit status with its
 * evidence for its account transport in both execution modes and for every container capability, and nothing
 * unproven may launch.
 */
final class HostCapabilitiesTest extends TestCase
{
    private const string UNRECORDED = 'No evidence is recorded for this combination.';

    private string $matrixPath = '';

    public function test_every_client_states_its_account_transport_with_evidence_in_both_execution_modes(): void
    {
        foreach (HookProgram::cases() as $program) {
            foreach (ExecutionModeType::cases() as $mode) {
                $this->assertRecorded($this->capabilityQuery(HostCapabilityType::AccountTransport, $program, $mode));
            }
        }
    }

    public function test_every_container_capability_has_an_explicit_status_with_evidence_for_both_clients(): void
    {
        foreach (HostCapabilityType::cases() as $capability) {
            foreach (HookProgram::cases() as $program) {
                $this->assertRecorded(
                    $this->capabilityQuery($capability, $program, ExecutionModeType::RequiredContainer),
                );
            }
        }
    }

    public function test_nothing_is_recorded_as_supported_in_a_container_without_native_evidence(): void
    {
        $capabilities = $this->app->make(HostCapabilities::class);

        $this->assertSame(
            CapabilityStatusType::Unverified,
            $capabilities->capability(
                $this->capabilityQuery(
                    HostCapabilityType::AccountTransport,
                    HookProgram::ClaudeCode,
                    ExecutionModeType::RequiredContainer,
                ),
            )->status,
        );
        $this->assertSame(
            CapabilityStatusType::Unsupported,
            $capabilities->capability(
                $this->capabilityQuery(
                    HostCapabilityType::AccountTransport,
                    HookProgram::Codex,
                    ExecutionModeType::RequiredContainer,
                ),
            )->status,
        );

        foreach (HostCapabilityType::cases() as $capability) {
            foreach (HookProgram::cases() as $program) {
                $this->assertNotSame(
                    CapabilityStatusType::Supported,
                    $capabilities->capability(
                        $this->capabilityQuery($capability, $program, ExecutionModeType::RequiredContainer),
                    )->status,
                );
            }
        }
    }

    public function test_a_launch_of_an_unproven_account_transport_is_refused_as_account_container_unsupported(): void
    {
        $capability = $this->app->make(HostCapabilities::class)->capability(
            $this->capabilityQuery(
                HostCapabilityType::AccountTransport,
                HookProgram::Codex,
                ExecutionModeType::RequiredContainer,
            ),
        );

        try {
            $capability->requireSupported();
            $this->fail('An unproven combination was admitted.');
        } catch (AccountContainerUnsupported $refusal) {
            $this->assertSame(LaunchRefusalType::AccountContainerUnsupported, $refusal->reason());
            $this->assertStringStartsWith(
                'The journal cannot launch account-transport for codex with a subscription account in required_container mode: ',
                $refusal->getMessage(),
            );
            $this->assertStringEndsWith('Nothing was launched.', $refusal->getMessage());
        }
    }

    public function test_a_stop_guarantee_without_a_proven_stop_deadline_is_refused_before_work(): void
    {
        $capability = $this->app->make(HostCapabilities::class)->capability(
            $this->capabilityQuery(
                HostCapabilityType::StopDeadline,
                HookProgram::ClaudeCode,
                ExecutionModeType::RequiredContainer,
            ),
        );

        try {
            $capability->requireSupported();
            $this->fail('An unproven stop guarantee was admitted.');
        } catch (HostCapabilityUnsupported $refusal) {
            $this->assertSame(LaunchRefusalType::CapabilityUnsupported, $refusal->reason());
            $this->assertStringStartsWith(
                'The journal cannot guarantee stop-deadline for claude-code with a subscription account in required_container mode: ',
                $refusal->getMessage(),
            );
        }
    }

    public function test_a_supported_row_admits_and_a_missing_row_is_unverified(): void
    {
        $capabilities = new RecordedHostCapabilities(
            $this->matrix(
                [
                    [
                        'capability' => 'account-transport',
                        'program' => 'codex',
                        'account_mode' => 'subscription',
                        'execution_mode' => 'protected_host',
                        'status' => 'supported',
                        'evidence' => 'docs/x.md',
                        'reason' => 'Proven.',
                    ],
                ],
            ),
        );

        $capabilities->capability(
            $this->capabilityQuery(
                HostCapabilityType::AccountTransport,
                HookProgram::Codex,
                ExecutionModeType::ProtectedHost,
            ),
        )->requireSupported();
        $this->assertSame(
            CapabilityStatusType::Unverified,
            $capabilities->capability(
                $this->capabilityQuery(
                    HostCapabilityType::AccountTransport,
                    HookProgram::ClaudeCode,
                    ExecutionModeType::ProtectedHost,
                ),
            )->status,
        );
    }

    public function test_a_row_with_an_unknown_status_is_refused_by_name(): void
    {
        $capabilities = new RecordedHostCapabilities(
            $this->matrix(
                [
                    [
                        'capability' => 'account-transport',
                        'program' => 'codex',
                        'account_mode' => 'subscription',
                        'execution_mode' => 'protected_host',
                        'status' => 'maybe',
                        'evidence' => 'docs/x.md',
                        'reason' => 'Unsure.',
                    ],
                ],
            ),
        );

        $this->expectExceptionObject(CapabilityMatrixInvalid::row($this->matrixPath, 0, 'status'));

        $capabilities->capability(
            $this->capabilityQuery(
                HostCapabilityType::AccountTransport,
                HookProgram::Codex,
                ExecutionModeType::ProtectedHost,
            ),
        );
    }

    private function assertRecorded(HostCapabilityQuery $query): void
    {
        $capability = $this->app->make(HostCapabilities::class)->capability($query);

        $this->assertNotSame(self::UNRECORDED, $capability->reason, "{$query->describe()} has no row.");
        $this->assertFileExists(base_path(strtok($capability->evidence, '#')));
    }

    private function capabilityQuery(
        HostCapabilityType $capability,
        HookProgram $program,
        ExecutionModeType $mode,
    ): HostCapabilityQuery {
        return new HostCapabilityQuery($capability, $program, AccountModeType::Subscription, $mode);
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
