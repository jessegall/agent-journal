<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\ImportRuleProposals\ImportRuleProposalsCommand;
use App\Enums\CommandRules\CommandClass;
use App\Enums\CommandRules\ProposalStatus;
use App\Exceptions\DeclarationInvalid;
use App\Models\CommandRules\ClassificationRule;
use App\Models\CommandRules\RuleProposal;
use App\Models\CommandRules\RuleRevision;
use App\Values\CommandClassSet;
use App\Values\RuleExample;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Importing a declaration file makes proposals only; an invalid file is refused naming its fields.
 */
final class ImportRuleProposalsTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_importing_a_declaration_file_creates_only_proposals(): void
    {
        $file = json_encode(['declarations' => [[
            'request_id' => 'import-1',
            'evidence' => 'acme --help documents verify',
            'examples' => [RuleExample::positive('acme verify', CommandClassSet::of(CommandClass::Read))->toArray()],
            'rule' => AcmeDeclarations::verify()->toArray(),
        ]]], JSON_THROW_ON_ERROR);

        $receipts = $this->runAsAgentId('agent-1', new ImportRuleProposalsCommand($file))->receipts;

        $this->assertCount(1, $receipts);
        $this->assertSame(ProposalStatus::Pending, $receipts[0]->state);
        $proposal = RuleProposal::query()->findOrFail($receipts[0]->proposalId);
        $this->assertEquals(AcmeDeclarations::verify(), $proposal->revisions()->firstOrFail()->payload);
        $this->assertSame(0, ClassificationRule::query()->count());
        $this->assertSame(0, RuleRevision::query()->count());
    }

    public function test_an_invalid_declaration_file_is_refused_naming_its_fields(): void
    {
        $rule = AcmeDeclarations::verify()->toArray();
        $rule['purpose'] = 'harmless';
        $rule['contracts'][0]['exits']['branches'][0]['status'] = 300;
        $declaration = ['request_id' => 'import-1', 'evidence' => '', 'examples' => [], 'rule' => $rule];
        $file = json_encode(['declarations' => [$declaration]]);

        try {
            $this->runAsAgentId('agent-1', new ImportRuleProposalsCommand((string) $file));
            $this->fail('The broken file was imported.');
        } catch (DeclarationInvalid $refusal) {
            $this->assertCount(2, $refusal->fields);
            $this->assertStringContainsString('declarations.0.rule.purpose', implode(' ', $refusal->fields));
        }

        $this->assertSame(0, RuleProposal::query()->count());
    }
}
