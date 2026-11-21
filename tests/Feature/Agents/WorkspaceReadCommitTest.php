<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\ActorGuidance;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Support\EnrolledHost;
use App\Agents\Values\CommitObservation;
use App\Agents\Values\WorkReference;
use App\Agents\Values\WorkspaceReadReference;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A host's workspace read report carries a version 2 commit observation for a connected root, stored once with its
 * first sample; a report without a version stays version 1 and authorizes no commit dispatch.
 */
final class WorkspaceReadCommitTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = ['workspace_reads', 'hosts'];

    private const string HEAD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    protected function setUp(): void
    {
        parent::setUp();

        // The actor's wake is not what this test is about; the read's stored sample is.
        $this->app->instance(ActorGuidance::class, new class implements ActorGuidance
        {
            public function retain(ActorIdentity $actor, string $guidance, string $key): void {}
        });
    }

    public function test_a_version_2_report_stores_its_commit_once(): void
    {
        $host = $this->enrolledHost();
        $read = $this->retained('read-1');

        $this->report($host, 'read-1', ['version' => 2, 'binding' => 'binding-1', 'checkout' => 'main', 'head' => self::HEAD])
            ->assertNoContent();
        $this->report($host, 'read-1', ['version' => 2, 'binding' => 'binding-1', 'checkout' => 'main', 'head' => str_repeat('b', 40)])
            ->assertNoContent();

        $commit = $this->commitOf($read);
        $this->assertSame([2, 'binding-1', 'main', self::HEAD], [$commit->version, $commit->bindingId, $commit->checkoutId, $commit->headOid]);
        $this->assertTrue($commit->authorizesCommitDispatch());
    }

    public function test_an_unborn_root_keeps_its_reason_and_a_report_without_a_version_stays_version_1(): void
    {
        $host = $this->enrolledHost();
        $unborn = $this->retained('read-unborn');
        $old = $this->retained('read-old');

        $this->report($host, 'read-unborn', ['version' => 2, 'binding' => 'binding-1', 'checkout' => 'main', 'reason' => CommitObservation::UNBORN])
            ->assertNoContent();
        $this->report($host, 'read-old', [])->assertNoContent();

        $this->assertSame([2, CommitObservation::UNBORN], [$this->commitOf($unborn)->version, $this->commitOf($unborn)->reason]);
        $this->assertFalse($this->commitOf($unborn)->authorizesCommitDispatch());
        $this->assertSame(1, $this->commitOf($old)->version);
        $this->assertFalse($this->commitOf($old)->authorizesCommitDispatch());
    }

    private function retained(string $reference): WorkspaceRead
    {
        return WorkspaceRead::retain(new WorkspaceReadReference($reference), TestActors::agentIdentity(1), WorkReference::free('chain-1'));
    }

    /**
     * @param  array<string, mixed>  $commit
     */
    private function report(EnrolledHost $host, string $reference, array $commit): TestResponse
    {
        return $this->hostCall($host, "/host/workspace-reads/{$reference}", [
            'available' => true,
            'dirty' => false,
            'clean' => true,
            'generation' => 1,
            ...$commit,
        ]);
    }

    private function commitOf(WorkspaceRead $read): CommitObservation
    {
        return WorkspaceRead::byReference($read->reference())->facts()->get()->commit;
    }
}
