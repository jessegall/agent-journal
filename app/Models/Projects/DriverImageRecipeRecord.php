<?php

declare(strict_types=1);

namespace App\Models\Projects;

use App\Agents\Drivers\Setup\DriverImageRecipe;
use App\Concerns\BoundedReads;
use App\Models\Support\JournalModel;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Attributes\Table;

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
 */
#[Table('driver_image_recipes')]
final class DriverImageRecipeRecord extends JournalModel
{
    use BoundedReads;

    public const null UPDATED_AT = null;

    protected function casts(): array
    {
        return [
            'created_at' => 'immutable_datetime',
        ];
    }

    /**
     * The kept row of the recipe: stored the first time, found by its digest every time after, never changed.
     */
    public static function keep(DriverImageRecipe $recipe): self
    {
        $kept = self::query()->where('recipe_digest', $recipe->digest)->first();

        if ($kept !== null) {
            return $kept;
        }

        $record = new self();
        $record->recipe_digest = $recipe->digest;
        $record->folder = $recipe->folder;
        $record->base_image = $recipe->base;
        $record->version = $recipe->version;
        $record->context = base64_encode($recipe->context);
        $record->save();

        return $record;
    }

    /**
     * Whether a host still keeps an image of the recipe, so the recipe may not be pruned.
     */
    public function isDemanded(): bool
    {
        return HostDriverImage::query()->where('driver_image_recipe_id', $this->id)->exists();
    }

    /**
     * The recipe this row keeps, from its own bytes.
     */
    public function inputs(): DriverImageRecipe
    {
        $context = (string) base64_decode($this->context, true);

        return DriverImageRecipe::kept(
            $this->folder,
            $this->base_image,
            $this->version,
            $context,
            $this->recipe_digest,
        );
    }
}
