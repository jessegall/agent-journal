<?php

declare(strict_types=1);

namespace Tests\Feature\Links;

use App\Models\Records\Link;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Relation;
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

        Relation::morphMap(
            ['fixtures.note' => Note::class, 'fixtures.label' => Label::class],
        );
        Schema::create('notes', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('owner');
            $table->timestamps();
        });
        Schema::create('labels', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function test_two_model_types_are_linked_and_found_from_both_sides(): void
    {
        $note = Note::ownedBy('visible');
        $label = Label::named('urgent');

        Link::createForModels($note, $label);

        $this->assertTrue($note->isLinkedTo($label));
        $this->assertTrue($label->isLinkedTo($note));
        $this->assertSame([$label->id], $note->links()->among(Label::query())->pluck('id')->all());
        $this->assertSame([$note->id], $label->links()->among(Note::query())->pluck('id')->all());
    }

    public function test_the_table_refuses_a_second_row_for_the_same_link(): void
    {
        $note = Note::ownedBy('visible');
        $label = Label::named('urgent');
        Link::createForModels($note, $label);

        $this->expectException(QueryException::class);

        $this->insertRawLink($note, $label);
    }

    public function test_linked_models_are_found_only_among_the_models_the_caller_may_see(): void
    {
        $visible = Note::ownedBy('visible');
        $hidden = Note::ownedBy('someone else');
        $label = Label::named('urgent');
        Link::createForModels($label, $visible);
        $this->insertRawLink($hidden, $label);

        $this->assertSame([$visible->id], $label->links()->among(Note::query())->pluck('id')->all());
        $this->assertCount(2, $label->links()->among(Note::query()->withoutGlobalScopes())->get());
    }

    public function test_only_models_of_the_queried_type_are_found(): void
    {
        $note = Note::ownedBy('visible');
        $label = Label::named('urgent');
        $otherLabel = Label::named('later');
        Link::createForModels($note, $label);
        Link::createForModels($otherLabel, $label);

        $this->assertSame([$otherLabel->id], $label->links()->among(Label::query())->pluck('id')->all());
    }

    public function test_a_link_can_itself_be_linked_through_the_same_table(): void
    {
        $note = Note::ownedBy('visible');
        $label = Label::named('urgent');
        Link::createForModels($note, $label);
        $link = Link::query()->sole();

        Link::createForModels($link, $note);

        $this->assertTrue($link->isLinkedTo($note));
        $this->assertSame([$note->id], $link->links()->among(Note::query())->pluck('id')->all());
        $this->assertSame(2, Link::query()->count());
    }

    /**
     * Writes a link row directly, past Link::createForModels, as a racing or foreign writer would.
     */
    private function insertRawLink(Model $source, Model $target): void
    {
        Link::create(
            $source->getMorphClass(),
            (string) $source->getKey(),
            $target->getMorphClass(),
            (string) $target->getKey(),
        );
    }
}
