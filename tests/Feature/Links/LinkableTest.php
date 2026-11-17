<?php

declare(strict_types=1);

namespace Tests\Feature\Links;

use App\Domain\Links\Models\Link;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Links\Label;
use Tests\Fixtures\Links\Note;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

final class LinkableTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->string('owner');
            $table->timestamps();
        });
        Schema::create('labels', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function test_two_model_types_are_linked_and_found_from_both_sides(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);

        $note->linkTo($label);

        $this->assertTrue($note->isLinkedTo($label));
        $this->assertTrue($label->isLinkedTo($note));
        $this->assertSame([$label->id], $note->links()->among(Label::query())->pluck('id')->all());
        $this->assertSame([$note->id], $label->links()->among(Note::query())->pluck('id')->all());
    }

    public function test_linking_again_in_either_direction_keeps_one_link(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);

        $first = $note->linkTo($label);
        $again = $note->linkTo($label);
        $reversed = $label->linkTo($note);

        $this->assertSame($first->id, $again->id);
        $this->assertSame($first->id, $reversed->id);
        $this->assertSame(1, Link::query()->count());
    }

    public function test_the_table_refuses_a_second_row_for_the_same_link(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);
        $note->linkTo($label);

        $this->expectException(QueryException::class);

        Link::query()->create($this->row($note, $label));
    }

    public function test_unlinking_removes_the_link_from_both_sides(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);
        $label->linkTo($note);

        $note->unlinkFrom($label);

        $this->assertFalse($label->isLinkedTo($note));
        $this->assertSame(0, Link::query()->count());
    }

    public function test_linked_models_are_found_only_among_the_models_the_caller_may_see(): void
    {
        $visible = Note::query()->create(['owner' => 'visible']);
        $hidden = Note::query()->create(['owner' => 'someone else']);
        $label = Label::query()->create(['name' => 'urgent']);
        $label->linkTo($visible);
        Link::query()->create($this->row($hidden, $label));

        $this->assertSame([$visible->id], $label->links()->among(Note::query())->pluck('id')->all());
        $this->assertCount(2, $label->links()->among(Note::query()->withoutGlobalScopes())->get());
    }

    public function test_only_models_of_the_queried_type_are_found(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);
        $otherLabel = Label::query()->create(['name' => 'later']);
        $note->linkTo($label);
        $otherLabel->linkTo($label);

        $this->assertSame([$otherLabel->id], $label->links()->among(Label::query())->pluck('id')->all());
    }

    public function test_a_link_can_itself_be_linked_through_the_same_table(): void
    {
        $note = Note::query()->create(['owner' => 'visible']);
        $label = Label::query()->create(['name' => 'urgent']);
        $link = $note->linkTo($label);

        $link->linkTo($note);

        $this->assertTrue($link->isLinkedTo($note));
        $this->assertSame([$note->id], $link->links()->among(Note::query())->pluck('id')->all());
        $this->assertSame(2, Link::query()->count());
    }

    /**
     * @return array<string, int|string>
     */
    private function row(Model $source, Model $target): array
    {
        return [
            'source_type' => $source->getMorphClass(),
            'source_id' => (int) $source->getKey(),
            'target_type' => $target->getMorphClass(),
            'target_id' => (int) $target->getKey(),
        ];
    }
}
