<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Actors\Contracts\CurrentActor;
use App\Data\Pages\RecordCard;
use App\Links\Concerns\ProvidesModelRecords;
use App\Records\Contracts\RecordProvider;
use App\Support\BoundedReadBuilder;
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
        return Rule::linkType();
    }

    protected function readableRecords(): BoundedReadBuilder
    {
        $this->actors->actor();

        return Rule::query();
    }

    protected function cardOf(Model $record): RecordCard
    {
        return $this->numberedCard($record, "rule {$record->number}", $record->text, "/rules?rule={$record->id}");
    }

    protected function mayChange(Model $record): bool
    {
        return false;
    }
}
