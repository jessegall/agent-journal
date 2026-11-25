<?php

declare(strict_types=1);

namespace App\Models\Skills;

use App\Concerns\BoundedReads;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Concerns\RaisesEvents;
use App\Contracts\Events\EventSource;
use App\Contracts\Records\ReadableModel;
use App\Data\Skills\GeneratedSkillData;
use App\Enums\GenerationState;
use App\Events\Skills\SkillGenerationRetired;
use App\Exceptions\SkillGenerationImmutable;
use App\Models\Support\Accessor;
use App\Values\GenerationStatus;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $catalogue_digest
 * @property string $registration_digest
 * @property GeneratedSkillData[]|DataCollection<array-key, GeneratedSkillData> $entries
 * @property GenerationState $state
 * @property ?string $error_reason
 * @property ?Carbon $created_at
 * @property ?Carbon $updated_at
 * @property mixed $status attribute
 */
final class SkillGeneration extends Model implements EventSource, ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;
    use OrdersById;
    use RaisesEvents;

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'entries' => DataCollection::class.':'.GeneratedSkillData::class,
            'state' => GenerationState::class,
        ];
    }

    protected static function booted(): void
    {
        self::updating(fn (self $generation) => $generation->assertContentUnedited());
    }

    // ----------[ Constructors ]----------

    /**
     * The generation one refresh made: Ready with the catalogue's digest and its definitions, or Failed with the
     * reason, an empty digest and no definitions; a Ready one has no error.
     *
     * @param  list<GeneratedSkillData>  $definitions
     */
    public static function create(
        string $registrationDigest,
        GenerationState $state,
        string $catalogueDigest,
        array $definitions,
        string|null $errorReason,
    ): self {
        $skillGeneration = new self();
        $skillGeneration->catalogue_digest = $catalogueDigest;
        $skillGeneration->registration_digest = $registrationDigest;
        $skillGeneration->entries = $definitions;
        $skillGeneration->state = $state;
        $skillGeneration->error_reason = $errorReason;
        $skillGeneration->assertSaved($skillGeneration->save());

        return $skillGeneration;
    }

    // ----------[ Mutations ]----------

    public function retire(): void
    {
        $this->state = GenerationState::Retired;
        $this->assertSaved($this->save());
        $this->raise(new SkillGenerationRetired($this->id));
    }

    /**
     * The entry of this key, or null when the generation holds none.
     */
    public function entry(string $key): GeneratedSkillData|null
    {
        foreach ($this->entries as $entry) {
            if ($entry->key === $key) {
                return $entry;
            }
        }

        return null;
    }

    // ----------[ Accessors ]----------

    /**
     * @return Attribute<GenerationStatus, never>
     */
    protected function status(): Attribute
    {
        return Accessor::get(fn () => new GenerationStatus($this->id, $this->state, $this->catalogue_digest, $this->error_reason));
    }

    // ----------[ Asserts ]----------

    /**
     * Refuses an edit of a generation's entries or digests: what a generation holds stays as it was written.
     *
     * @throws SkillGenerationImmutable
     */
    private function assertContentUnedited(): void
    {
        if ($this->isDirty([
            'entries',
            'catalogue_digest',
            'registration_digest',
        ])) {
            throw SkillGenerationImmutable::for($this->id);
        }
    }

    // ----------[ Queries ]----------

    /**
     * The immutable generation the publication delivers.
     */
    public static function findForPublication(SkillPublication $publication): self
    {
        return self::query()->whereKey($publication->generation_id)->firstOrFail();
    }

    /**
     * The newest ready generation, or null before the first refresh.
     */
    public static function latestReady(): self|null
    {
        return self::query()->inState(GenerationState::Ready)->newestFirst()->first();
    }

    /**
     * The newest generation of any state, for status.
     */
    public static function latest(): self|null
    {
        return self::query()->newestFirst()->first();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, GenerationState $state): void
    {
        $query->where('state', $state->value);
    }
}
