<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Concerns\BoundedReads;
use App\Concerns\InsertsAbsentRows;
use App\Concerns\Linkable;
use App\Concerns\OrdersById;
use App\Models\Agents\AgentSession;
use App\Models\Support\Accessor;
use App\Models\Support\JournalModel;
use App\Records\Contracts\ReadableModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

/**
 * A driver image recipe as the journal kept it, once: the exact tar bytes, base and version a host builds from, so a
 * build or rebuild of it never reads the deploy's folder again. A kept recipe never changes.
 *
 * @property string $id
 * @property string $recipe_digest
 * @property string $folder
 * @property string $base_image
 * @property string $version
 * @property string $context the canonical tar, base64
 * @property CarbonImmutable $created_at
 * @property-read DriverImageRecipe $recipe
 */
#[Table('driver_image_recipes')]
final class DriverImageRecipeRecord extends JournalModel implements ReadableModel
{
    use BoundedReads;
    use InsertsAbsentRows;
    use Linkable;
    use OrdersById;

    public const null UPDATED_AT = null;

    // ----------[ Constructors ]----------

    /**
     * The kept row of the recipe: stored the first time, found by its digest every time after, never changed; the
     * unique digest keeps two hosts that keep it at once to one row.
     */
    public static function create(DriverImageRecipe $recipe): self
    {
        $record = new self();
        $record->recipe_digest = $recipe->digest;
        $record->folder = $recipe->folder;
        $record->base_image = $recipe->base;
        $record->version = $recipe->version;
        $record->context = base64_encode($recipe->context);
        $record->setAttribute($record->getKeyName(), $record->newUniqueId());
        $record->insertIfAbsent();

        return self::findForDigest($recipe->digest);
    }

    // ----------[ Accessors ]----------

    /**
     * The recipe this row keeps, from its own bytes.
     *
     * @return Attribute<DriverImageRecipe, never>
     */
    protected function recipe(): Attribute
    {
        return Accessor::get(fn () => DriverImageRecipe::kept(
            $this->folder,
            $this->base_image,
            $this->version,
            (string) base64_decode($this->context, true),
            $this->recipe_digest,
        ));
    }

    // ----------[ Queries ]----------

    /**
     * The recipes that sessions started on the host froze and that have not ended, as each may resume there.
     *
     * @return list<self>
     */
    public static function findFrozenOn(string $hostId): array
    {
        $digests = AgentSession::resolveFrozenRecipeDigestsOn($hostId);

        return array_values(self::query()->withDigests($digests)->oldestFirst()->get()->all());
    }

    public static function findForDigest(string $digest): self
    {
        return self::query()->withDigests([$digest])->firstOrFail();
    }

    /**
     * The folders of the named recipes, keyed by recipe id.
     *
     * @param  list<string>  $ids
     * @return array<string, string>
     */
    public static function resolveFoldersOf(array $ids): array
    {
        return self::query()->ofRecipeIds($ids)->pluck('folder', 'id')->all();
    }

    // ----------[ Scopes ]----------

    /**
     * The recipes of the digests.
     *
     * @param  Builder<self>  $query
     * @param  list<string>  $digests
     */
    #[Scope]
    protected function withDigests(Builder $query, array $digests): void
    {
        $query->whereIn('recipe_digest', $digests);
    }

    /**
     * @param  Builder<self>  $query
     * @param  list<string>  $ids
     */
    #[Scope]
    protected function ofRecipeIds(Builder $query, array $ids): void
    {
        $query->whereIn('id', $ids);
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function inFolder(Builder $query, string $folder): void
    {
        $query->where('folder', $folder);
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function notFrozen(Builder $query): void
    {
        $query->whereNotIn(
            'recipe_digest',
            AgentSession::query()->liveOnFrozenRecipe()->frozenRecipeDigests(),
        );
    }

    /** @param  Builder<self>  $query */
    #[Scope]
    protected function recipeIds(Builder $query): void
    {
        $query->select('id');
    }
}
