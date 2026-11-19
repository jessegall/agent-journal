<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Enums\AssignmentOutcomeType;
use App\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Assignments\Exceptions\InvalidAssignmentPage;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentGroup;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentReference;
use App\Assignments\Support\AssignmentResult;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\Page;
use App\Records\Exceptions\InvalidRecordIdentity;
use App\Records\Support\RecordIdentity;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
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
        $user = new ActorIdentity(ActorType::User, TestIds::of(7));

        $this->assertFalse($user->isSameAs(new ActorIdentity(ActorType::Agent, TestIds::of(7))));
        $this->assertTrue($user->isSameAs(new ActorIdentity(ActorType::User, TestIds::of(7))));
    }

    public function test_a_group_holds_its_root_and_each_record_once(): void
    {
        $root = new RecordIdentity('plans.plan', TestIds::of(3));
        $task = new RecordIdentity('tasks.task', TestIds::of(12));

        $group = new AssignmentGroup($root, [$task, new RecordIdentity('plans.plan', TestIds::of(3)), new RecordIdentity('tasks.task', TestIds::of(12))]);

        $this->assertSame([$root, $task], $group->records);
    }

    public function test_a_group_of_more_than_a_thousand_records_is_refused(): void
    {
        $records = array_map(fn (int $number) => new RecordIdentity('tasks.task', TestIds::of($number)), range(1, 1000));

        $this->expectException(AssignmentGroupTooLarge::class);

        new AssignmentGroup(new RecordIdentity('plans.plan', TestIds::of(1)), $records);
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

        new Page($afterId, $limit);
    }

    public function test_a_set_finds_a_records_assignment_or_answers_none(): void
    {
        $task = new RecordIdentity('tasks.task', TestIds::of(12));
        $assignment = new Assignment($task, new AssignmentReference(TestIds::of(42), new AssigneeIdentity(ActorType::Agent->value, TestIds::of(7))));
        $set = new AssignmentSet([$assignment]);

        $this->assertSame($assignment, $set->forRecord(new RecordIdentity('tasks.task', TestIds::of(12)))->get());
        $this->assertTrue($set->forRecord(new RecordIdentity('tasks.task', TestIds::of(13)))->isEmpty());
    }

    public function test_a_result_counts_its_outcomes_by_type(): void
    {
        $result = new AssignmentResult([
            new AssignmentOutcome(new RecordIdentity('tasks.task', TestIds::of(1)), null, AssignmentOutcomeType::Unchanged),
            new AssignmentOutcome(new RecordIdentity('tasks.task', TestIds::of(2)), null, AssignmentOutcomeType::SkippedFinished),
            new AssignmentOutcome(new RecordIdentity('tasks.task', TestIds::of(3)), null, AssignmentOutcomeType::SkippedFinished),
        ], []);

        $this->assertSame(2, $result->count(AssignmentOutcomeType::SkippedFinished));
        $this->assertFalse($result->hasChanges());
    }
}
