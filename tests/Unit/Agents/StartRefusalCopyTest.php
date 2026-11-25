<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Enums\Sessions\CapacityResource;
use App\Enums\Sessions\HostRefusal;
use App\Enums\Sessions\ResumeRefusal;
use App\Enums\Sessions\StartPreflightRefusal;
use App\Enums\Sessions\StartRefusalType;
use App\Enums\Sessions\StartRemedyType;
use App\Exceptions\CapacityUnavailable;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * Every start refusal reads as its public explanation and its one next step, as the design lists them; a step only a host
 * operator can take reads to every other member as a request to ask their host operator.
 */
final class StartRefusalCopyTest extends TestCase
{
    /**
     * @return array<string, array{StartRefusalType|StartPreflightRefusal|ResumeRefusal|HostRefusal, string, StartRemedyType, string, string}>
     */
    public static function refusals(): array
    {
        return [
            'model-required' => [
                StartRefusalType::ModelRequired,
                'Choose a model for this session.',
                StartRemedyType::ChooseModel,
                'Choose model',
                'Choose model',
            ],
            'model-unavailable' => [
                StartRefusalType::ModelUnavailable,
                'The selected model is unavailable.',
                StartRemedyType::ChooseModel,
                'Choose another model',
                'Choose another model',
            ],
            'default-unavailable' => [
                StartRefusalType::DefaultUnavailable,
                'The default model is unavailable.',
                StartRemedyType::ChooseModel,
                'Choose model',
                'Choose model',
            ],
            'driver-required' => [
                StartRefusalType::DriverRequired,
                'Choose a driver for this session.',
                StartRemedyType::ChooseDriver,
                'Choose driver',
                'Choose driver',
            ],
            'driver-conflict' => [
                StartRefusalType::DriverConflict,
                'The selected driver conflicts with this configuration.',
                StartRemedyType::ChooseDriver,
                'Review driver',
                'Review driver',
            ],
            'driver-unsupported' => [
                StartRefusalType::DriverUnsupported,
                'This driver cannot run here.',
                StartRemedyType::ChooseDriver,
                'Choose a supported driver',
                'Choose a supported driver',
            ],
            'account-container-unsupported' => [
                StartRefusalType::AccountContainerUnsupported,
                'This account cannot run in this environment.',
                StartRemedyType::ChooseAccount,
                'Choose a compatible account',
                'Choose a compatible account',
            ],
            'capability-unsupported' => [
                StartRefusalType::CapabilityUnsupported,
                'A required feature is unavailable with these settings.',
                StartRemedyType::ReviewConfiguration,
                'Review configuration',
                'Review configuration',
            ],
            'context-failed' => [
                StartRefusalType::ContextFailed,
                'The journal could not prepare this session.',
                StartRemedyType::RetryStart,
                'Retry start when eligible; otherwise ask the operator to check setup',
                'Retry start when eligible; otherwise ask the operator to check setup',
            ],
            'container-unavailable' => [
                StartRefusalType::ContainerUnavailable,
                'The host cannot provide a container.',
                StartRemedyType::OperatorInstruction,
                'Restore container service',
                'Ask your host operator to restore container service.',
            ],
            'image-unverified' => [
                StartRefusalType::ImageUnverified,
                'The host could not verify its agent image.',
                StartRemedyType::OperatorInstruction,
                'Verify the host image',
                'Ask your host operator to verify the host image.',
            ],
            'capacity-unavailable' => [
                StartRefusalType::CapacityUnavailable,
                'The host lacks the required CPU, memory or disk.',
                StartRemedyType::CheckCapacity,
                'Check capacity',
                'Ask your host operator to check capacity.',
            ],
            'driver-pinned' => [
                StartPreflightRefusal::DriverPinned,
                'This profile requires its assigned driver.',
                StartRemedyType::ChooseDriver,
                'Use the assigned driver',
                'Use the assigned driver',
            ],
            'model-not-allowed' => [
                StartPreflightRefusal::ModelNotAllowed,
                'This profile does not allow that model.',
                StartRemedyType::ChooseModel,
                'Choose an allowed model',
                'Choose an allowed model',
            ],
            'driver-not-containable' => [
                StartPreflightRefusal::DriverNotContainable,
                'This driver cannot run with the required protection here.',
                StartRemedyType::ChooseDriver,
                'Choose a supported driver',
                'Choose a supported driver',
            ],
            'no-host' => [
                StartPreflightRefusal::NoHost,
                'No connected host serves this environment.',
                StartRemedyType::ConnectHost,
                'Connect a host',
                'Ask your host operator to connect a host.',
            ],
            'combination-not-declared' => [
                StartPreflightRefusal::CombinationNotDeclared,
                'The host does not support these settings together.',
                StartRemedyType::ReviewConfiguration,
                'Review configuration',
                'Review configuration',
            ],
            'account-folder-rejected' => [
                HostRefusal::AccountFolderRejected,
                'The host could not verify the protection required for this account.',
                StartRemedyType::OperatorInstruction,
                'Check account-folder ownership on the host',
                'Ask your host operator to check account-folder ownership on the host.',
            ],
            'identity-mismatch' => [
                HostRefusal::IdentityMismatch,
                HostRefusal::IdentityMismatch->explanation(),
                StartRemedyType::RetryStart,
                'Start the agent again',
                'Start the agent again',
            ],
            'pinned-build-missing' => [
                HostRefusal::PinnedBuildMissing,
                HostRefusal::PinnedBuildMissing->explanation(),
                StartRemedyType::OperatorInstruction,
                'Restore the pinned build on the host, or end the session and start a new one',
                'Ask your host operator to restore the pinned build on the host, or end the session and start a new one.',
            ],
            'conversation-missing' => [
                ResumeRefusal::ConversationMissing,
                'This conversation is unavailable to resume.',
                StartRemedyType::ChooseConversation,
                'Choose an eligible conversation',
                'Choose an eligible conversation',
            ],
            'other-agent' => [
                ResumeRefusal::OtherAgent,
                'This conversation is unavailable to resume.',
                StartRemedyType::ChooseConversation,
                'Choose an eligible conversation',
                'Choose an eligible conversation',
            ],
            'other-driver' => [
                ResumeRefusal::OtherDriver,
                'This conversation uses a different driver.',
                StartRemedyType::StartNewConversation,
                'Start a new conversation',
                'Start a new conversation',
            ],
            'other-context' => [
                ResumeRefusal::OtherContext,
                'This conversation cannot continue in this work.',
                StartRemedyType::StartNewConversation,
                'Start a new conversation',
                'Start a new conversation',
            ],
            'unknown' => [
                HostRefusal::Unknown,
                'The host declined this request.',
                StartRemedyType::OperatorInstruction,
                'Give the operator the safe request reference',
                'Give the operator the safe request reference',
            ],
        ];
    }

    #[DataProvider('refusals')]
    public function test_a_refusal_reads_as_its_explanation_and_its_one_next_step(
        StartRefusalType|StartPreflightRefusal|ResumeRefusal|HostRefusal $refusal,
        string $explanation,
        StartRemedyType $type,
        string $operatorText,
        string $memberText,
    ): void {
        $remedy = $refusal->remedy();

        $this->assertSame(
            [$explanation, $type, $operatorText, $memberText],
            [$refusal->explanation(), $remedy->type, $remedy->operatorText(), $remedy->memberText()],
        );
    }

    public function test_every_case_is_listed(): void
    {
        $listed = array_map(fn (array $row) => $row[0], self::refusals());
        $cases = [
            ...StartRefusalType::cases(),
            ...StartPreflightRefusal::cases(),
            ...ResumeRefusal::cases(),
            ...HostRefusal::cases(),
        ];

        $this->assertCount(count($cases), $listed);

        foreach ($cases as $case) {
            $this->assertContains($case, $listed);
        }
    }

    public function test_a_capacity_refusal_names_the_resource_it_did_not_fit_in(): void
    {
        $this->assertSame(
            [
                'The host lacks the required CPU.',
                'The host lacks the required memory.',
                'The host lacks the required disk.',
            ],
            array_map(
                fn (CapacityResource $resource) => CapacityUnavailable::because($resource, 'it did not fit.')
                    ->explanation(),
                CapacityResource::cases(),
            ),
        );
    }
}
