<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Enums\CommandRules\RequestState;
use App\Exceptions\ReaderProofFailed;
use App\Exceptions\RevisionImmutable;
use App\Models\Runs\ReaderProof;
use App\Models\Runs\ReaderRevision;
use Tests\Support\Processes\RunsAcmeRequests;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\TestCase;

/**
 * The journal proves a draft reader itself, by replaying it over real samples it captured for the request, one per
 * exit branch, after the request's actor read them.
 */
final class ReaderProofTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsAcmeRequests;
    use SendsSignedPayloads;

    private const string UNRECOGNIZED_OUTPUT = 'output_unrecognized at stdout bytes 0-16';

    private const string NOT_READ = 'has not read';

    protected function setUp(): void
    {
        parent::setUp();

        $this->openAcmeRequest();
    }

    public function test_a_reader_proven_on_a_passing_sample_alone_lists_the_other_branch_as_unproven(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);

        $refusal = $this->failedProof($this->reader(), [$passed]);

        $this->assertSame([1], $refusal->unprovenStatuses);
        $this->assertSame([], $refusal->failures);
        $this->assertSame(RequestState::AwaitingProof, $this->request()->state);
    }

    public function test_a_reader_that_leaves_an_error_line_unaccounted_fails_naming_its_offsets(): void
    {
        $passed = $this->sample(0, "error: disk full\n".self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);

        $refusal = $this->failedProof($this->reader(), [$passed, $findings]);

        $this->assertStringContainsString(self::UNRECOGNIZED_OUTPUT, implode(' ', $refusal->failures));
        $this->assertSame(0, ReaderProof::query()->count());
    }

    public function test_a_sample_its_author_never_read_proves_nothing(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: false);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);

        $refusal = $this->failedProof($this->reader(), [$passed, $findings]);

        $this->assertStringContainsString(self::NOT_READ, implode(' ', $refusal->failures));
    }

    public function test_samples_for_every_branch_prove_the_reader_and_the_request_awaits_approval(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);
        $reader = $this->reader();

        $proofId = $this->runAsAgent(new ProveReaderCommand($this->requestId, $reader, [$passed, $findings]));

        $proof = ReaderProof::query()->findOrFail($proofId);
        $this->assertSame([0, 1], array_map(fn ($branch) => $branch->status, $proof->proven_branches->items()));
        $this->assertArrayHasKey('stdout', $proof->proven_branches[0]->manifests);
        $this->assertSame(RequestState::AwaitingApproval, $this->request()->state);
        $this->assertTrue(ReaderRevision::query()->findOrFail($reader)->isProven());
        $proof->actor_id = 'someone-else';
        $this->assertThrows(fn () => $proof->save(), RevisionImmutable::class);
    }

    public function test_a_changed_reader_is_a_new_draft_without_a_proof(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);
        $this->runAsAgent(new ProveReaderCommand($this->requestId, $this->reader(), [$passed, $findings]));

        $changed = ReaderRevision::query()->findOrFail($this->reader());

        $this->assertFalse($changed->isProven());
    }

    /**
     * @param  list<string>  $runs
     */
    private function failedProof(string $reader, array $runs): ReaderProofFailed
    {
        try {
            $this->runAsAgent(new ProveReaderCommand($this->requestId, $reader, $runs));
        } catch (ReaderProofFailed $refusal) {
            return $refusal;
        }

        $this->fail('The reader was proven.');
    }
}
