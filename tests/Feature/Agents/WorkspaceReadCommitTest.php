<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\ActorGuidance;
use App\Models\Projects\WorkspaceRead;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use App\Values\AgentText;
use App\Values\CommitObservation;
use App\Values\WorkReference;
use App\Values\WorkspaceReadReference;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A host's workspace read report for a binding's checkout carries its commit observation, stored once with its first
 * sample; a report that names no binding is a plain sample and authorizes no commit dispatch.
 */
final class WorkspaceReadCommitTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['workspace_reads', 'hosts'];

    private const string HEAD = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    protected function setUp(): void
    {
        parent::setUp();

        // The actor's wake is not what this test is about; the read's stored sample is.
        $this->app->instance(ActorGuidance::class, new class implements ActorGuidance
        {
            public function retain(ActorIdentity $actor, AgentText $guidance, string $key): void {}
        });
    }

    public function test_a_report_for_a_binding_stores_its_commit_once(): void
    {
        $host = $this->journal->enrolledHost();
        $read = $this->retained('read-1');

        $this->notify($host, 'read-1', ['binding' => 'binding-1', 'checkout' => 'main', 'head' => self::HEAD])
            ->assertNoContent();
        $this->notify($host, 'read-1', ['binding' => 'binding-1', 'checkout' => 'main', 'head' => str_repeat('b', 40)])
            ->assertNoContent();

        $commit = $this->commitOf($read);
        $this->assertSame(
            ['binding-1', 'main', self::HEAD],
            [$commit->bindingId, $commit->checkoutId, $commit->headOid],
        );
        $this->assertTrue($commit->authorizesCommitDispatch());
    }

    public function test_an_unborn_root_keeps_its_reason_and_a_report_naming_no_binding_stays_a_plain_sample(): void
    {
        $host = $this->journal->enrolledHost();
        $unborn = $this->retained('read-unborn');
        $old = $this->retained('read-old');

        $this->notify(
            $host,
            'read-unborn',
            ['binding' => 'binding-1', 'checkout' => 'main', 'reason' => CommitObservation::UNBORN],
        )
            ->assertNoContent();
        $this->notify($host, 'read-old', [])->assertNoContent();

        $this->assertSame(
            [true, CommitObservation::UNBORN],
            [$this->commitOf($unborn)->isRecorded(), $this->commitOf($unborn)->reason],
        );
        $this->assertFalse($this->commitOf($unborn)->authorizesCommitDispatch());
        $this->assertFalse($this->commitOf($old)->isRecorded());
        $this->assertFalse($this->commitOf($old)->authorizesCommitDispatch());
    }

    private function retained(string $reference): WorkspaceRead
    {
        return WorkspaceRead::create(
            new WorkspaceReadReference($reference),
            TestActors::agentIdentity(1),
            WorkReference::free('chain-1'),
        );
    }

    /**
     * @param  array<string, mixed>  $commit
     */
    private function notify(EnrolledHost $host, string $reference, array $commit): TestResponse
    {
        return $this->journal->hostCall($host, 'POST', "/host/workspace-reads/{$reference}", [
            'available' => true,
            'dirty' => false,
            'clean' => true,
            'generation' => 1,
            ...$commit,
        ]);
    }

    private function commitOf(WorkspaceRead $read): CommitObservation
    {
        return WorkspaceRead::findByReference($read->reference)->facts->get()->commit;
    }
}
