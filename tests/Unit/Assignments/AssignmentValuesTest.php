<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Core\Actors\Enums\ActorType;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Enums\AssignmentOutcomeType;
use App\Core\Assignments\Exceptions\AssignmentGroupTooLarge;
use App\Core\Assignments\Exceptions\InvalidAssignmentIdentity;
use App\Core\Assignments\Exceptions\InvalidAssignmentPage;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentGroup;
use App\Core\Assignments\Support\AssignmentOutcome;
use App\Core\Assignments\Support\AssignmentReference;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\Page;
use App\Core\Assignments\Support\RecordIdentity;
use PhpOption\None;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * The public assignment values: identities and pages refuse bad input when they are built, a group keeps each record
 * once under its limit, and a set answers an absent assignment as an empty Option.
 */
final class AssignmentValuesTest extends TestCase
{
    /**
     * @return iterable<string, array{string, int}>
     */
    public static function invalidRecords(): iterable
    {
        yield 'no alias' => ['', 1];
        yield 'a class name' => ['App\\Domain\\Tasks\\Models\\Task', 1];
        yield 'no owner part' => ['task', 1];
        yield 'a zero id' => ['tasks.task', 0];
        yield 'a negative id' => ['tasks.task', -4];
    }

    #[DataProvider('invalidRecords')]
    public function test_a_record_identity_refuses_a_bad_type_or_id(string $type, int $id): void
    {
        $this->expectException(InvalidAssignmentIdentity::class);

        new RecordIdentity($type, $id);
    }

    public function test_a_user_and_an_agent_with_the_same_id_are_different_actors(): void
    {
        $user = new ActorIdentity(ActorType::User, 7);

        $this->assertFalse($user->isSameAs(new ActorIdentity(ActorType::Agent, 7)));
        $this->assertTrue($user->isSameAs(new ActorIdentity(ActorType::User, 7)));
    }

    public function test_a_group_holds_its_root_and_each_record_once(): void
    {
        $root = new RecordIdentity('plans.plan', 3);
        $task = new RecordIdentity('tasks.task', 12);

        $group = new AssignmentGroup($root, [$task, new RecordIdentity('plans.plan', 3), new RecordIdentity('tasks.task', 12)]);

        $this->assertSame([$root, $task], $group->records);
    }

    public function test_a_group_of_more_than_a_thousand_records_is_refused(): void
    {
        $records = array_map(fn (int $id) => new RecordIdentity('tasks.task', $id), range(1, 1000));

        $this->expectException(AssignmentGroupTooLarge::class);

        new AssignmentGroup(new RecordIdentity('plans.plan', 1), $records);
    }

    /**
     * @return iterable<string, array{int|null, int}>
     */
    public static function invalidPages(): iterable
    {
        yield 'no entries' => [null, 0];
        yield 'too many entries' => [null, 101];
        yield 'a cursor that is no id' => [0, 20];
    }

    #[DataProvider('invalidPages')]
    public function test_a_page_refuses_a_bad_limit_or_cursor(int|null $afterId, int $limit): void
    {
        $this->expectException(InvalidAssignmentPage::class);

        new Page($afterId, $limit);
    }

    public function test_a_set_finds_a_records_assignment_or_answers_none(): void
    {
        $task = new RecordIdentity('tasks.task', 12);
        $assignment = new Assignment($task, new AssignmentReference(42, new ActorIdentity(ActorType::Agent, 7)));
        $set = new AssignmentSet([$assignment]);

        $this->assertSame($assignment, $set->forRecord(new RecordIdentity('tasks.task', 12))->get());
        $this->assertTrue($set->forRecord(new RecordIdentity('tasks.task', 13))->isEmpty());
    }

    public function test_a_result_counts_its_outcomes_by_type(): void
    {
        $result = new AssignmentResult([
            new AssignmentOutcome(new RecordIdentity('tasks.task', 1), None::create(), AssignmentOutcomeType::Unchanged),
            new AssignmentOutcome(new RecordIdentity('tasks.task', 2), None::create(), AssignmentOutcomeType::SkippedFinished),
            new AssignmentOutcome(new RecordIdentity('tasks.task', 3), None::create(), AssignmentOutcomeType::SkippedFinished),
        ], []);

        $this->assertSame(2, $result->count(AssignmentOutcomeType::SkippedFinished));
        $this->assertFalse($result->hasChanges());
    }
}
