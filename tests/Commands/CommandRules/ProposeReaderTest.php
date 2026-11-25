<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\CommandRules\RequestStatus;
use App\Models\Agents\Agent;
use App\Models\CommandRules\CommandRequest;
use App\Models\Runs\ReaderRevision;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\StartsTestAgent;
use Tests\TestCase;

/**
 * An agent proposes a reader for its request, which is a draft that unlocks nothing; a definition without the summary
 * rule the contract requires, or for a declaration revision that is missing, is refused.
 */
final class ProposeReaderTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedPayloads;
    use StartsTestAgent;

    private const string OPERATION = 'acme verify';

    private const string SUMMARY_RULE = 'summary rule';

    private CommandRequest $request;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $requestId = $this->runAsAgent(new OpenCommandRequestCommand(
            self::OPERATION,
            str_repeat('a', 64),
            self::OPERATION,
            '/projects/acme',
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRuleCommand($requestId, 'request-1', AcmeDeclarations::proposedVerify()));
        $this->request = CommandRequest::query()->findOrFail($requestId);
    }

    public function test_a_proposed_reader_is_a_draft_that_unlocks_nothing(): void
    {
        $reply = $this->proposeReader($this->definition(hasSummary: true))->assertOk();

        $revision = ReaderRevision::query()->findOrFail($reply->json('reader_revision_id'));
        $this->assertFalse($revision->isProven());
        $this->assertSame($this->request->id, $revision->command_request_id);
        $this->assertSame(1, $revision->declaration_revision);
        $this->assertSame(self::OPERATION, $revision->operation);
        $this->assertSame(RequestStatus::AwaitingSampleApproval, $this->request->refresh()->status);
    }

    public function test_a_definition_without_the_summary_rule_the_contract_requires_is_refused(): void
    {
        $reply = $this->proposeReader($this->definition(hasSummary: false))->assertStatus(422);

        $this->assertStringContainsString(self::SUMMARY_RULE, (string) $reply->json('message'));
        $this->assertSame(0, ReaderRevision::query()->count());
    }

    public function test_a_reader_for_a_missing_declaration_revision_is_refused(): void
    {
        $this->signed($this->start, "/agent/processes/requests/{$this->request->id}/readers", [
            'declaration_revision' => 2,
            'definition' => $this->definition(hasSummary: true),
        ])->assertStatus(409);
    }

    /**
     * @param  array<string, mixed>  $definition
     */
    private function proposeReader(array $definition): TestResponse
    {
        return $this->signed($this->start, "/agent/processes/requests/{$this->request->id}/readers", [
            'declaration_revision' => 1,
            'definition' => $definition,
        ]);
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
