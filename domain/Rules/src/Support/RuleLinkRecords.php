<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Concerns\ProvidesModelRecords;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Records\RecordProvider;
use App\Data\RecordCard;
use App\Support\ReadBuilder;
use Domain\Rules\Models\Rule;
use Illuminate\Container\Attributes\Scoped;
use Illuminate\Database\Eloquent\Model;

/**
 * Rules as linkable records: every signed-in actor reads every rule, and only a user's review changes one.
 */
#[Scoped]
final readonly class RuleLinkRecords implements RecordProvider
{
    /**
     * @use ProvidesModelRecords<Rule>
     */
    use ProvidesModelRecords;

    public function __construct(private CurrentActor $actors) {}

    public function referenceWord(): string
    {
        return 'rule';
    }

    protected function linkType(): string
    {
        return Rule::LINK_TYPE;
    }

    protected function readableRecords(): ReadBuilder
    {
        $this->actors->actor();

        return Rule::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return RecordCard::from([
            'type' => Rule::LINK_TYPE,
            'id' => $record->id,
            'number' => (string) $record->number,
            'label' => "rule {$record->number}",
            'title' => $record->text,
            'abstract' => null,
            'route' => "/rules?rule={$record->id}",
        ]);
    }

    protected function mayChange(Model $record): bool
    {
        return false;
    }
}
