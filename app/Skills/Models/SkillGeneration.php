<?php

declare(strict_types=1);

namespace App\Skills\Models;

use App\Links\Support\Linkable;
use App\Reads\Contracts\ReadableModel;
use App\Reads\Support\BoundedReads;
use App\Skills\Enums\GenerationState;
use App\Skills\Exceptions\SkillGenerationImmutable;
use App\Skills\Values\GenerationStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * One checked rendering of the whole catalogue: the digests it was made from and every entry's rendered bytes. The
 * files on disk are written from it, and a ready generation's entries never change.
 *
 * @property string $id
 * @property string $catalogue_digest
 * @property string $registration_digest
 * @property list<array{key: string, owner: string, revision: int|null, markdown: string, digest: string}> $entries
 * @property GenerationState $state
 * @property string|null $error_reason
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['catalogue_digest', 'registration_digest', 'entries', 'state', 'error_reason'])]
final class SkillGeneration extends Model implements ReadableModel
{
    use BoundedReads;
    use HasUlids;
    use Linkable;

    public const string LINK_TYPE = 'core.skill-generation';

    // ----------[ Constructors ]----------

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'entries' => 'array',
            'state' => GenerationState::class,
        ];
    }

    protected static function booted(): void
    {
        self::updating(function (self $generation): void {
            if ($generation->isDirty(['entries', 'catalogue_digest', 'registration_digest'])) {
                throw SkillGenerationImmutable::for($generation->id);
            }
        });
    }

    /**
     * The generation one refresh made: Ready with the catalogue's digest and its definitions, or Failed with the
     * reason, an empty digest and no definitions; a Ready one has no error.
     *
     * @param  list<array{key: string, owner: string, revision: int|null, markdown: string, digest: string}>  $definitions
     */
    public static function create(
        string $registrationDigest,
        GenerationState $state,
        string $catalogueDigest,
        array $definitions,
        string|null $errorReason,
    ): self {
        return self::query()->create(
            [
                'catalogue_digest' => $catalogueDigest,
                'registration_digest' => $registrationDigest,
                'entries' => $definitions,
                'state' => $state,
                'error_reason' => $errorReason,
            ],
        );
    }

    // ----------[ Queries ]----------

    /**
     * The newest ready generation, or null before the first refresh.
     */
    public static function latestReady(): self|null
    {
        return self::query()->inState(GenerationState::Ready)->orderByDesc('created_at')->orderByDesc('id')->first();
    }

    /**
     * The newest generation of any state, for status.
     */
    public static function latest(): self|null
    {
        return self::query()->orderByDesc('created_at')->orderByDesc('id')->first();
    }

    // ----------[ Mutations ]----------

    public function retire(): void
    {
        $this->state = GenerationState::Retired;
        $this->save();
    }

    // ----------[ Answers ]----------

    public function status(): GenerationStatus
    {
        return new GenerationStatus($this->id, $this->state, $this->catalogue_digest, $this->error_reason);
    }

    /**
     * The entry of this key, or null when the generation holds none.
     *
     * @return array{key: string, owner: string, revision: int|null, markdown: string, digest: string}|null
     */
    public function entry(string $key): array|null
    {
        foreach ($this->entries as $entry) {
            if ($entry['key'] === $key) {
                return $entry;
            }
        }

        return null;
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
