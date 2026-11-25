<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Enums\Assignments\ActorType;
use App\Enums\Assignments\AssignmentOutcomeType;
use App\Exceptions\AssignmentGroupTooLarge;
use App\Exceptions\InvalidAssignmentPage;
use App\Exceptions\InvalidRecordIdentity;
use App\Support\AssigneeIdentity;
use App\Support\Assignment;
use App\Support\AssignmentGroup;
use App\Support\AssignmentOutcome;
use App\Support\AssignmentReference;
use App\Support\AssignmentResult;
use App\Support\AssignmentSet;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * The public assignment values: identities and pages refuse bad input when they are built, a group keeps each record
 * once under its limit, and a set answers an absent assignment as an empty Option.
 */
final class AssignmentValuesTest extends TestCase
{
    /**
     * @return iterable<string, array{string, string}>
     */
    public static function invalidRecords(): iterable
    {
        yield 'no alias' => ['', TestIds::of(1)];

        yield 'a class name' => ['App\\Domain\\Tasks\\Models\\Task', TestIds::of(1)];

        yield 'no owner part' => ['task', TestIds::of(1)];

        yield 'a number for an id' => ['tasks.task', '12'];

        yield 'a word for an id' => ['tasks.task', 'not-a-ulid'];
    }

    #[DataProvider('invalidRecords')]
    public function test_a_record_identity_refuses_a_bad_type_or_id(string $type, string $id): void
    {
        $this->expectException(InvalidRecordIdentity::class);

        new RecordIdentity($type, $id);
    }

    public function test_a_user_and_an_agent_with_the_same_id_are_different_actors(): void
    {
        $user = TestActors::userIdentity(7);

        $this->assertFalse($user->isSameAs(TestActors::agentIdentity(7)));
        $this->assertTrue($user->isSameAs(TestActors::userIdentity(7)));
    }

    public function test_a_group_holds_its_root_and_each_record_once(): void
    {
        $root = TestActors::record('plans.plan', 3);
        $task = TestActors::record('tasks.task', 12);

        $group = new AssignmentGroup(
            $root,
            [$task, TestActors::record('plans.plan', 3), TestActors::record('tasks.task', 12)],
        );

        $this->assertSame([$root, $task], $group->records);
    }

    public function test_a_group_of_more_than_a_thousand_records_is_refused(): void
    {
        $records = array_map(fn (int $number) => TestActors::record('tasks.task', $number), range(1, 1000));

        $this->expectException(AssignmentGroupTooLarge::class);

        new AssignmentGroup(TestActors::record('plans.plan', 1), $records);
    }

    /**
     * @return iterable<string, array{int|null, int}>
     */
    public static function invalidPages(): iterable
    {
        yield 'no entries' => [null, 0];

        yield 'too many entries' => [null, 101];

        yield 'a cursor that is no id' => ['12', 20];
    }

    #[DataProvider('invalidPages')]
    public function test_a_page_refuses_a_bad_limit_or_cursor(string|null $afterId, int $limit): void
    {
        $this->expectException(InvalidAssignmentPage::class);

        new IdListPage($afterId, $limit);
    }

    public function test_a_set_finds_a_records_assignment_or_answers_none(): void
    {
        $task = TestActors::record('tasks.task', 12);
        $assignment = new Assignment(
            $task,
            new AssignmentReference(TestIds::of(42), new AssigneeIdentity(ActorType::Agent->value, TestIds::of(7))),
        );
        $set = new AssignmentSet([$assignment]);

        $this->assertSame($assignment, $set->forRecord(TestActors::record('tasks.task', 12))->get());
        $this->assertTrue($set->forRecord(TestActors::record('tasks.task', 13))->isEmpty());
    }

    public function test_a_result_counts_its_outcomes_by_type(): void
    {
        $result = new AssignmentResult([
            new AssignmentOutcome(TestActors::record('tasks.task', 1), null, AssignmentOutcomeType::Unchanged),
            new AssignmentOutcome(TestActors::record('tasks.task', 2), null, AssignmentOutcomeType::SkippedFinished),
            new AssignmentOutcome(TestActors::record('tasks.task', 3), null, AssignmentOutcomeType::SkippedFinished),
        ], []);

        $this->assertSame(2, $result->count(AssignmentOutcomeType::SkippedFinished));
        $this->assertFalse($result->hasChanges());
    }
}
