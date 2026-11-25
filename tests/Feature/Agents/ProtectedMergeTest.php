<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Work\HelperCommitImport;
use App\Enums\Reviews\MergeAttemptState;
use App\Enums\Reviews\MergeRefusalReason;
use App\Models\Reviews\MergeAttempt;
use App\Support\ActorIdentity;
use App\Support\ProtectedMerge;
use App\Support\RecordIdentity;
use App\Values\ApprovedHead;
use App\Values\ReviewDecisionReference;
use Illuminate\Process\Factory;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Agents\CertifiesHelperWork;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The protected merge of reviewed work: a clean merge publishes the exact reviewed head onto the
 * checked-out target, a conflict leaves the target as it was with its paths, and an interrupted attempt with no effect
 * merges when it is inspected again.
 */
#[TimeLimit(seconds: 8, reason: 'It builds two git repositories, imports between them and merges.')]
final class ProtectedMergeTest extends TestCase
{
    use CertifiesHelperWork;
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->buildHelperRepositories();
        $this->app->instance(
            ProtectedMerge::class,
            new ProtectedMerge($this->app->make(Factory::class), "{$this->folder}/parent"),
        );
    }

    protected function tearDown(): void
    {
        $this->removeHelperRepositories();

        parent::tearDown();
    }

    public function test_a_clean_merge_publishes_the_reviewed_head_onto_the_target(): void
    {
        $attempt = $this->approvedAttempt();

        $this->app->make(ProtectedMerge::class)->merge($attempt);

        $this->assertSame(MergeAttemptState::Merged, $attempt->state);
        $this->assertSame($this->git("{$this->folder}/parent", 'rev-parse', 'version-6'), $attempt->result);
        $this->git("{$this->folder}/parent", 'merge-base', '--is-ancestor', $attempt->head, 'version-6');
        $this->assertFileDoesNotExist("{$this->folder}/hook-ran");
    }

    public function test_a_conflict_leaves_the_target_as_it_was(): void
    {
        $attempt = $this->approvedAttempt();
        file_put_contents("{$this->folder}/parent/first-fix.txt", 'the parent wrote this first');
        $this->git("{$this->folder}/parent", 'add', '--all');
        $this->git("{$this->folder}/parent", '-c', 'user.name=Test', '-c', 'user.email=test@example.test', 'commit', '-q', '-m', 'parent');
        $before = $this->git("{$this->folder}/parent", 'rev-parse', 'version-6');

        $this->app->make(ProtectedMerge::class)->merge($attempt);

        $this->assertSame([MergeAttemptState::Refused, MergeRefusalReason::Conflict], [$attempt->state, $attempt->refusal]);
        $this->assertStringContainsString('first-fix.txt', (string) $attempt->evidence);
        $this->assertSame($before, $this->git("{$this->folder}/parent", 'rev-parse', 'version-6'));
    }

    public function test_an_interrupted_attempt_with_no_effect_merges_when_inspected(): void
    {
        $attempt = $this->approvedAttempt();
        $attempt->apply($this->git("{$this->folder}/parent", 'rev-parse', 'version-6'));

        $this->app->make(ProtectedMerge::class)->inspect($attempt);

        $this->assertSame(MergeAttemptState::Merged, $attempt->state);
    }

    private function approvedAttempt(): MergeAttempt
    {
        $start = TestStart::start('writing-helper');
        $this->certifyHelperWork($start, 'attempt-1');
        $work = new RecordIdentity('helpers.helper-job', self::WORK_ID);
        $import = $this->app->make(HelperCommitImport::class)->importCertified($work, 'attempt-1');

        return MergeAttempt::retain(new ApprovedHead(
            $work,
            'attempt-1',
            'version-6',
            $import->base,
            $import->head,
            $import->ref,
            new ReviewDecisionReference((string) Str::ulid()),
            ActorIdentity::of($start->agent),
            (string) Str::ulid(),
            0,
        ));
    }
}
