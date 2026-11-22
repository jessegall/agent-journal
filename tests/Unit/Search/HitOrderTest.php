<?php

declare(strict_types=1);

namespace Tests\Unit\Search;

use App\Support\RecordIdentity;
use App\Enums\ScoreTier;
use App\Values\HitIdentity;
use App\Values\RecordLocation;
use App\Values\SearchResult;
use App\Values\SourceHit;
use PHPUnit\Framework\TestCase;

/**
 * One global order for hits: score descending, then source key, record type, record id and location ascending in
 * binary order, with an absent location first.
 */
final class HitOrderTest extends TestCase
{
    private const string FIRST_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAA';

    private const string SECOND_ID = '01ARZ3NDEKTSV4RRFFQ69G5FAB';

    public function test_identities_compare_part_by_part_in_binary_order(): void
    {
        $tasks = new HitIdentity('tasks.task', 'tasks.task', self::FIRST_ID);

        $this->assertLessThan(0, $tasks->compare(new HitIdentity('tasks.task', 'tasks.task', self::SECOND_ID)));
        $this->assertLessThan(0, $tasks->compare(new HitIdentity('tasks.tasl', 'tasks.task', self::FIRST_ID)));
        $this->assertLessThan(0, $tasks->compare(new HitIdentity('tasks.task', 'tasks.tasl', self::FIRST_ID)));
        $this->assertGreaterThan(0, $tasks->compare(new HitIdentity('Tasks.task', 'tasks.task', self::FIRST_ID)));
        $this->assertSame(0, $tasks->compare(new HitIdentity('tasks.task', 'tasks.task', self::FIRST_ID)));
    }

    public function test_an_absent_location_comes_before_any_location(): void
    {
        $record = new HitIdentity('tasks.log', 'tasks.task', self::FIRST_ID);
        $line = new HitIdentity('tasks.log', 'tasks.task', self::FIRST_ID, 'a');
        $laterLine = new HitIdentity('tasks.log', 'tasks.task', self::FIRST_ID, 'b');

        $this->assertLessThan(0, $record->compare($line));
        $this->assertGreaterThan(0, $line->compare($record));
        $this->assertLessThan(0, $line->compare($laterLine));
        $this->assertFalse($record->equals($line));
        $this->assertNotSame($record->key(), $line->key());
    }

    public function test_hits_order_by_score_before_identity(): void
    {
        $a = $this->hit('tasks.task', self::SECOND_ID, ScoreTier::ExactTitle);
        $b = $this->hit('tasks.task', self::FIRST_ID, ScoreTier::TitleContains);
        $c = $this->hit('rules.rule', self::FIRST_ID, ScoreTier::TitlePrefix);
        $d = $this->hit('rules.rule', self::SECOND_ID, ScoreTier::BodyContains);

        $this->assertSame([$a, $c, $b, $d], SourceHit::ordered([$d, $b, $c, $a]));
    }

    public function test_equal_scores_tie_on_source_key_then_record_id(): void
    {
        $rule = $this->hit('rules.rule', self::SECOND_ID, ScoreTier::TitlePrefix);
        $firstTask = $this->hit('tasks.task', self::FIRST_ID, ScoreTier::TitlePrefix);
        $secondTask = $this->hit('tasks.task', self::SECOND_ID, ScoreTier::TitlePrefix);

        $this->assertSame([$rule, $firstTask, $secondTask], SourceHit::ordered([$secondTask, $firstTask, $rule]));
    }

    public function test_two_passages_of_one_parent_stay_apart(): void
    {
        $parent = $this->hit('tasks.log', self::FIRST_ID, ScoreTier::BodyContains);
        $line = $this->hit('tasks.log', self::FIRST_ID, ScoreTier::BodyContains, new RecordLocation('b', 'Line 2'));
        $other = $this->hit('tasks.log', self::FIRST_ID, ScoreTier::BodyContains, new RecordLocation('a', 'Line 1'));

        $this->assertSame([$parent, $other, $line], SourceHit::ordered([$line, $other, $parent]));
    }

    private function hit(
        string $source,
        string $id,
        ScoreTier $score,
        RecordLocation|null $location = null,
    ): SourceHit {
        $reference = new RecordIdentity('tasks.task', $id);

        return new SourceHit($source, $source, new SearchResult('Title', 'Snippet', $reference, $score, $location));
    }
}
