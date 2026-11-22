<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Records\RecordVisibility;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Values\OwnerAuthority;
use Domain\Helpers\Exceptions\PurposeConflict;
use Domain\Helpers\Exceptions\PurposeRequired;
use Domain\Helpers\Exceptions\SubjectUnavailable;
use Domain\Helpers\Models\HelperPurpose;
use Domain\Helpers\Support\PurposeChoice;
use Domain\Helpers\Support\PurposeResolver;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * A helper job's purpose comes from exactly one of a subject, a purpose or words (doc 14 revision 4, decision D2):
 * one purpose per parent, profile and record however often it is asked for; a hidden record answers like a missing
 * one; words always make a new purpose.
 */
final class HelperPurposeTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $parent;

    private RecordIdentity $visible;

    protected function setUp(): void
    {
        parent::setUp();

        $actor = ActorContext::forUser('parent');
        $this->app->make(CurrentActorSetter::class)->set($actor, new OwnerAuthority('test'));
        $this->parent = ActorIdentity::of($actor);
        $this->visible = new RecordIdentity('plans.plan', (string) Str::ulid());
        $visible = $this->visible;

        $this->app->instance(RecordVisibility::class, new class($visible) implements RecordVisibility
        {
            public function __construct(private RecordIdentity $visible) {}

            public function isVisible(RecordIdentity $record): bool
            {
                return $record->type === $this->visible->type && $record->id === $this->visible->id;
            }
        });
    }

    public function test_asking_twice_for_one_record_gives_one_purpose(): void
    {
        $first = $this->resolve($this->visible, null, null);
        $second = $this->resolve($this->visible, null, null);

        $this->assertSame($first->id, $second->id);
        $this->assertSame("plans.plan:{$this->visible->id}", $first->label);
    }

    public function test_a_hidden_record_and_a_missing_one_answer_alike_and_leave_no_purpose(): void
    {
        $hidden = new RecordIdentity('plans.plan', (string) Str::ulid());
        $missing = new RecordIdentity('tasks.task', (string) Str::ulid());

        foreach ([$hidden, $missing] as $record) {
            $this->assertThrows(fn () => $this->resolve($record, null, null), SubjectUnavailable::class);
        }

        $this->assertSame(0, HelperPurpose::query()->count());
    }

    public function test_equal_words_make_two_purposes(): void
    {
        $first = $this->resolve(null, null, 'Review the release');
        $second = $this->resolve(null, null, 'Review the release');

        $this->assertNotSame($first->id, $second->id);
    }

    public function test_an_existing_purpose_is_found_by_its_id(): void
    {
        $purpose = $this->resolve(null, null, 'Look at the docs');

        $this->assertSame($purpose->id, $this->resolve(null, $purpose->id, null)->id);
        $this->assertThrows(fn () => $this->resolve(null, (string) Str::ulid(), null), SubjectUnavailable::class);
    }

    public function test_none_or_more_than_one_form_is_refused(): void
    {
        $this->assertThrows(fn () => $this->resolve(null, null, null), PurposeRequired::class);
        $this->assertThrows(fn () => $this->resolve($this->visible, null, 'And words'), PurposeConflict::class);
    }

    private function resolve(RecordIdentity|null $subject, string|null $purposeId, string|null $text): HelperPurpose
    {
        return $this->app->make(PurposeResolver::class)->resolve(
            new PurposeChoice($this->parent, 'read-only-helper', $subject, $purposeId, $text),
        );
    }
}
