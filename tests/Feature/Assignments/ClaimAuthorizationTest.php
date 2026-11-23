<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Enums\ClaimBasis;
use App\Models\Records\AssignmentRecord;
use App\Models\Records\ClaimAuthorization;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\RecordIdentity;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A claim stands on exact assignments: each proof shape saves and a wrong shape is refused, releasing claims removes
 * only those proved by the lost assignment, and a rejoined actor's new seat does not revive an old proof.
 */
final class ClaimAuthorizationTest extends TestCase
{
    use RefreshHookDatabase;

    private AssigneeIdentity $actor;

    protected function setUp(): void
    {
        parent::setUp();

        $this->actor = new AssigneeIdentity('agent', TestIds::of(7));
    }

    public function test_each_proof_shape_saves_and_a_wrong_shape_is_refused(): void
    {
        $seat = $this->hold('core.desk-seat', 1, $this->actor);
        $task = $this->hold('tasks.task', 2, new AssigneeIdentity('desk', TestIds::of(9)));

        $inbox = ClaimAuthorization::forInbox($this->hold('communication.message', 3, $this->actor), $seat);
        $deskRun = ClaimAuthorization::forDeskRun($this->hold('tasks.run', 4, $this->actor), $seat, $task);
        $directRun = ClaimAuthorization::forDirectRun($this->hold('tasks.run', 5, $this->actor), $task);

        $this->assertSame(
            [ClaimBasis::Inbox, ClaimBasis::DeskRun, ClaimBasis::DirectRun],
            [$inbox->basis_type, $deskRun->basis_type, $directRun->basis_type],
        );
        $this->assertThrows(fn () => DB::table('claim_authorizations')->insert([
            'id' => strtolower((string) Str::ulid()),
            'claim_assignment_id' => TestIds::of(11),
            'basis_type' => 'inbox',
            'participation_assignment_id' => null,
            'work_assignment_id' => $task->id,
        ]), QueryException::class);
    }

    public function test_releasing_claims_removes_only_those_proved_by_the_lost_assignment(): void
    {
        $lost = $this->hold('core.desk-seat', 1, $this->actor);
        $kept = $this->hold('core.desk-seat', 2, $this->actor);
        $gone = $this->hold('communication.message', 3, $this->actor);
        $stays = $this->hold('communication.message', 4, $this->actor);
        ClaimAuthorization::forInbox($gone, $lost);
        ClaimAuthorization::forInbox($stays, $kept);

        $this->assertSame(1, AssignmentRecord::claimsProvedBy($lost)->delete());

        $this->assertFalse(AssignmentRecord::stillExists($gone->id));
        $this->assertTrue(AssignmentRecord::stillExists($stays->id));
    }

    public function test_a_rejoined_actor_does_not_revive_an_old_proof(): void
    {
        $seat = $this->hold('core.desk-seat', 1, $this->actor);
        $proof = ClaimAuthorization::forInbox($this->hold('communication.message', 2, $this->actor), $seat);
        $this->assertTrue($proof->isValidFor($this->actor));

        AssignmentRecord::query()->withoutGlobalScopes()->whereKey($seat->id)->delete();
        $this->hold('core.desk-seat', 1, $this->actor);

        $this->assertFalse($proof->isValidFor($this->actor));
    }

    private function hold(string $type, int $number, AssigneeIdentity $holder): AssignmentReference
    {
        return AssignmentRecord::create(
            new RecordIdentity($type, TestIds::of($number)),
            $holder,
        )->toAssignment()->reference;
    }
}
