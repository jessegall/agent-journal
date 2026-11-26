<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Bus\Exceptions\CommandAdmissionRefused;
use App\CommandRules\Commands\ApproveSample\ApproveSampleCommand;
use App\CommandRules\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\CommandRules\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\CommandRules\Enums\RequestHoldReason;
use App\CommandRules\Exceptions\SampleRefused;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\EvidencePermit;
use App\Values\CommandRule;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The owner approves a sample run of a proposed declaration; an agent cannot, and a declaration without effects
 * cannot be approved for a sample.
 */
#[TestsCommand(ApproveSampleCommand::class)]
final class ApproveSampleTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private string $requestId;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $this->start = $this->journal->signedStart('Test agent');
        $this->requestId = $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->journal->runAsStart(
            $this->start,
            new ProposeCommandRuleCommand($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()),
        );
    }

    public function test_an_agent_cannot_approve_a_sample(): void
    {
        $this->assertThrows(
            fn () => $this->journal->runAsStart($this->start, $this->approval()),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(0, EvidencePermit::query()->count());
    }

    public function test_a_declaration_without_effects_cannot_be_approved_for_a_sample(): void
    {
        $other = $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('c', 64),
            'acme verify --all',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $rule = AcmeDeclarations::verify()->toArray();
        $rule['classes'] = ['classes' => []];
        $noEffects = AcmeDeclarations::proposed(CommandRule::from($rule));
        $this->journal->runAsStart(
            $this->start,
            new ProposeCommandRuleCommand($other, 'request-2', $noEffects),
        );
        $digest = CommandRequest::query()->findOrFail($other)->source_digest;

        $this->assertThrows(
            fn () => $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new ApproveSampleCommand($other, 1, $digest)),
            SampleRefused::class,
        );
    }

    private function approval(): ApproveSampleCommand
    {
        return new ApproveSampleCommand($this->requestId, 1, $this->request()->source_digest);
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }
}
