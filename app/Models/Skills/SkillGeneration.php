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
use App\Enums\Skills\GenerationStatus;
use App\Events\Skills\SkillGenerationRetired;
use App\Exceptions\SkillGenerationImmutable;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Values\GenerationReport;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Spatie\LaravelData\DataCollection;

/**
 * @property string $id
 * @property string $catalogue_digest
 * @property string $registration_digest
 * @property DataCollection<int, GeneratedSkillData> $entries
 * @property GenerationStatus $status
 * @property string|null $error_reason
 * @property CarbonImmutable|null $created_at
 * @property CarbonImmutable|null $updated_at
 *
 * @mixin \Eloquent
 */
final class SkillGeneration extends JournalModel implements EventSource, ReadableModel
{
    use BoundedReads;
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
            'status' => GenerationStatus::class,
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
        GenerationStatus $state,
        string $catalogueDigest,
        array $definitions,
        string|null $errorReason,
    ): self {
        $skillGeneration = new self();
        $skillGeneration->catalogue_digest = $catalogueDigest;
        $skillGeneration->registration_digest = $registrationDigest;
        $skillGeneration->entries = GeneratedSkillData::collect($definitions, DataCollection::class);
        $skillGeneration->status = $state;
        $skillGeneration->error_reason = $errorReason;
        $skillGeneration->assertSaved($skillGeneration->save());

        return $skillGeneration;
    }

    // ----------[ Mutations ]----------

    public function retire(): void
    {
        $this->status = GenerationStatus::Retired;
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
     * @return Attribute<GenerationReport, never>
     */
    protected function report(): Attribute
    {
        return Accessor::get(
            fn () => new GenerationReport($this->id, $this->status, $this->catalogue_digest, $this->error_reason),
        );
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
    public static function findLatestReady(): self|null
    {
        return self::query()->inState(GenerationStatus::Ready)->newestFirst()->first();
    }

    /**
     * The newest generation of any state, for status.
     */
    public static function findLatest(): self|null
    {
        return self::query()->newestFirst()->first();
    }

    // ----------[ Scopes ]----------

    /**
     * @param  Builder<self>  $query
     */
    #[Scope]
    protected function inState(Builder $query, GenerationStatus $state): void
    {
        $query->where('status', $state->value);
    }
}
