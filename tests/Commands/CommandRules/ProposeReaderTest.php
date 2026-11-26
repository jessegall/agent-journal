<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\ProposeReader\ProposeReaderCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Exceptions\ReaderDefinitionInvalid;
use App\Exceptions\ReaderProposalRefused;
use App\Models\Agents\Agent;
use App\Models\CommandRules\CommandRequest;
use App\Models\Runs\ReaderRevision;
use App\Values\ReaderDefinition;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An agent proposes a reader for its request, which is a draft that unlocks nothing; a definition without the summary
 * rule the contract requires, or for a declaration revision that is missing, is refused.
 */
#[TestsCommand(ProposeReaderCommand::class)]
final class ProposeReaderTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private const string OPERATION = 'acme verify';

    private const string SUMMARY_RULE = 'summary rule';

    private CommandRequest $request;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Test agent')->startSession('Test agent', 'Test agent');
        $this->start = $this->journal->testStartCalled('Test agent');

        ProcessOutputDisk::fake();
        $requestId = $this->journal->actAs('Test agent')->run(new OpenCommandRequestCommand(
            self::OPERATION,
            str_repeat('a', 64),
            self::OPERATION,
            '/projects/acme',
            RequestHoldReason::UnknownCommand,
        ));
        $this->journal->actAs('Test agent')->run(
            new ProposeCommandRuleCommand($requestId, 'request-1', AcmeDeclarations::proposedVerify()),
        );
        $this->request = CommandRequest::query()->findOrFail($requestId);
    }

    public function test_a_proposed_reader_is_a_draft_that_unlocks_nothing(): void
    {
        $revision = ReaderRevision::query()->findOrFail($this->proposeReader(1, $this->definition(hasSummary: true)));
        $this->assertFalse($revision->isProven());
        $this->assertSame($this->request->id, $revision->command_request_id);
        $this->assertSame(1, $revision->declaration_revision);
        $this->assertSame(self::OPERATION, $revision->operation);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, $this->request->refresh()->status);
    }

    public function test_a_definition_without_the_summary_rule_the_contract_requires_is_refused(): void
    {
        $this->journal->assertRefused(
            ReaderDefinitionInvalid::class,
            fn () => $this->proposeReader(1, $this->definition(hasSummary: false)),
            fn (ReaderDefinitionInvalid $refusal) => $this->assertStringContainsString(self::SUMMARY_RULE, $refusal->getMessage()),
        );
        $this->assertSame(0, ReaderRevision::query()->count());
    }

    public function test_a_reader_for_a_missing_declaration_revision_is_refused(): void
    {
        $this->journal->assertRefused(
            ReaderProposalRefused::class,
            fn () => $this->proposeReader(2, $this->definition(hasSummary: true)),
        );
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function proposeReader(int $declarationRevision, array $definition): string
    {
        return $this->journal->runAsStart($this->start, new ProposeReaderCommand(
            $this->request->id,
            $declarationRevision,
            ReaderDefinition::from($definition),
        ));
    }

    /**
     * @return array<string, mixed>
     */
    private function definition(bool $hasSummary): array
    {
        $rules = [['role' => 'outcome', 'pattern' => '^ok {name:rest}$']];

        if ($hasSummary) {
            $rules[] = ['role' => 'summary', 'pattern' => '^done {passed:int} {failed:int}$'];
        }

        return [
            'rules' => $rules,
            'count_fields' => [],
            'total_field' => null,
            'failure_field' => null,
            'max_record_bytes' => 65_536,
            'millisecond_budget' => 2_000,
        ];
    }
}
