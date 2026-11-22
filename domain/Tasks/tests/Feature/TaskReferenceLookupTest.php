<?php

declare(strict_types=1);

namespace Domain\Tasks\Tests\Feature;

use App\Enums\ScoreTier;
use App\Values\AdmittedConstraints;
use App\Values\AllowedNames;
use App\Values\RecognizedReference;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskReferenceLookup;
use Domain\Tasks\Support\TaskReferenceRecognizer;
use Domain\Tasks\Tests\TestCase;
use Illuminate\Support\Facades\DB;

/**
 * A whole task reference is recognized without a read and found in one indexed statement; an absent task and one
 * the reader may not see give the same empty answer, and a bare number issues no query at all.
 */
final class TaskReferenceLookupTest extends TestCase
{
    public function test_a_task_reference_is_found_by_one_indexed_read(): void
    {
        Task::factory()->create();
        $task = Task::factory()->create(['title' => 'Search through everything']);
        $reference = self::referenceOf("  TASK {$task->number} ");

        DB::enableQueryLog();
        $result = $this->app->make(TaskReferenceLookup::class)->find($reference, AdmittedConstraints::unrestricted());
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertSame(1, $queries);
        $this->assertNotNull($result);
        $this->assertSame($task->id, $result->reference->id);
        $this->assertSame(Task::LINK_TYPE, $result->reference->type);
        $this->assertSame(ScoreTier::Reference, $result->score);
        $this->assertSame("Task {$task->number} · Search through everything", $result->title);
        $this->assertSame("Task {$task->number}", $result->snippet);
    }

    public function test_an_invisible_task_and_an_absent_one_give_the_same_empty_answer(): void
    {
        $task = Task::factory()->create();
        $other = Task::factory()->create();
        $lookup = $this->app->make(TaskReferenceLookup::class);
        $onlyOther = new AdmittedConstraints(
            AllowedNames::only([$other->id]),
            AllowedNames::all(),
            AllowedNames::all(),
            AllowedNames::all(),
        );

        $invisible = $lookup->find(self::referenceOf("task {$task->number}"), $onlyOther);
        $absent = $lookup->find(self::referenceOf('task 999999'), AdmittedConstraints::unrestricted());

        $this->assertNull($invisible);
        $this->assertNull($absent);
    }

    public function test_a_bare_number_gets_a_hint_and_issues_no_query(): void
    {
        $recognizer = new TaskReferenceRecognizer();

        DB::enableQueryLog();
        $reference = $recognizer->recognize('7');
        $hint = $recognizer->hint('7');
        $queries = count(DB::getQueryLog());
        DB::disableQueryLog();

        $this->assertNull($reference);
        $this->assertSame('Type task 7', $hint);
        $this->assertSame(0, $queries);
    }

    public function test_only_the_whole_reference_is_recognized(): void
    {
        $recognizer = new TaskReferenceRecognizer();

        $this->assertNull($recognizer->recognize('task 2241 notes'));
        $this->assertNull($recognizer->recognize('plan 2241'));
        $this->assertNull($recognizer->recognize('task 02241'));
        $this->assertSame(2241, $recognizer->recognize('Task 2241')?->number);
        $this->assertNull($recognizer->hint('task 2241'));
    }

    private static function referenceOf(string $input): RecognizedReference
    {
        $reference = new TaskReferenceRecognizer()->recognize($input);
        self::assertInstanceOf(RecognizedReference::class, $reference);

        return $reference;
    }
}
